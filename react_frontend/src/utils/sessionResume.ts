import { getSubmissionById, getSubmissionHistory } from "@/services/user/history-service";
import { getQuestionsByIds, submitSubmission } from "@/services/user/question-service";
import type { SubmissionHistoryItem } from "@/types/history";
import type { Question, QuestionAttemptState } from "@/types/question";
import { SUBMISSION_PAGE_SIZE } from "@/utils/historyUtils";
import { isSubmissionNonContinuable } from "@/utils/sessionTimerStorage";
import type { ContinueSessionChoice } from "@/components/user/ContinueSessionModal";

export type SessionKind = "question_bank" | "set";

export interface ResumedSessionPayload {
  questions: Question[];
  submissionId: string;
  sessionAttempts: Record<string, QuestionAttemptState>;
}

type SetSessionQuestions = (
  questions: Question[],
  submissionId?: string | null,
  attemptsByQuestionId?: Record<string, QuestionAttemptState>
) => void;

const matchesKind = (submission: SubmissionHistoryItem, kind: SessionKind) =>
  kind === "question_bank"
    ? submission.type === "question_bank"
    : Boolean(submission.type?.startsWith("set_"));

const isFullyAttempted = (submission: SubmissionHistoryItem) => {
  const total = submission.selected_question_ids?.length ?? 0;
  return total > 0 && (submission.attempts?.length ?? 0) >= total;
};

const isActiveInProgress = (submission: SubmissionHistoryItem, kind: SessionKind) =>
  matchesKind(submission, kind) &&
  submission.status === "in_progress" &&
  Boolean(submission.selected_question_ids?.length) &&
  !isSubmissionNonContinuable(submission.submission_id);

/** History Continue button. */
export const isContinuableSubmission = (submission: SubmissionHistoryItem) =>
  isActiveInProgress(submission, submission.type === "question_bank" ? "question_bank" : "set") &&
  Boolean(submission.attempts?.length) &&
  !isFullyAttempted(submission);

/** Refresh restore (any active) or start flow (unfinished only). */
export const findLatestActive = (
  submissions: SubmissionHistoryItem[],
  kind: SessionKind,
  unfinishedOnly = false
) =>
  submissions.find(
    (submission) =>
      isActiveInProgress(submission, kind) && (!unfinishedOnly || !isFullyAttempted(submission))
  ) ?? null;

export const applyResumedSession = (
  setSessionQuestions: SetSessionQuestions,
  resumed: ResumedSessionPayload
) => {
  setSessionQuestions(resumed.questions, resumed.submissionId, resumed.sessionAttempts);
};

export const closeCompletedInProgress = async (
  submissions: SubmissionHistoryItem[],
  kind: SessionKind
) => {
  const zombies = submissions.filter(
    (submission) => isActiveInProgress(submission, kind) && isFullyAttempted(submission)
  );
  await Promise.allSettled(zombies.map((z) => submitSubmission(z.submission_id)));
};

export const fetchResumedSession = async (
  submissionId: string,
  signal?: AbortSignal
): Promise<ResumedSessionPayload | null> => {
  const detail = await getSubmissionById(submissionId, signal);
  if (!detail || detail.status !== "in_progress") return null;

  const questionIds = detail.selected_question_ids ?? [];
  if (!questionIds.length) return null;

  const questions = await getQuestionsByIds(questionIds);
  if (!questions.length) return null;

  const questionByText = new Map(questions.map((q) => [q.question_text, q]));
  const sessionAttempts: Record<string, QuestionAttemptState> = {};

  for (const attempt of detail.attempts ?? []) {
    const question = questionByText.get(attempt.question_text);
    if (!question) continue;
    const selected = attempt.selected_answers ?? [];
    sessionAttempts[question.id] = {
      selectedOptions: selected,
      selectedOption: question.option_type === "multiple" ? undefined : selected[0],
      isAttempted: true,
      isCorrect: attempt.is_correct,
    };
  }

  return { questions, submissionId: detail.submission_id, sessionAttempts };
};

export type StartResumeResult = "resumed" | "fresh" | "cancel";

const normalizeSetKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, " ");

const hasAttempts = (submission: SubmissionHistoryItem) => (submission.attempts?.length ?? 0) > 0;

/** Match CEE submission to a set via type (`set_{name}`) or submission_label. */
export const matchesSetSubmission = (submission: SubmissionHistoryItem, setName: string) => {
  const target = normalizeSetKey(setName);
  if (!target) return false;
  if (submission.submission_label && normalizeSetKey(submission.submission_label) === target) {
    return true;
  }
  if (submission.type?.startsWith("set_")) {
    return normalizeSetKey(submission.type.slice(4)) === target;
  }
  return false;
};

/** QB start: auto-continue 0-attempt, else ask. */
export const resolveUnfinishedStart = async (options: {
  kind: SessionKind;
  askContinue: () => Promise<ContinueSessionChoice>;
  setSessionQuestions: SetSessionQuestions;
}): Promise<StartResumeResult> => {
  const { kind, askContinue, setSessionQuestions } = options;
  const submissions = await getSubmissionHistory(kind === "question_bank" ? kind : undefined, {
    pageSize: SUBMISSION_PAGE_SIZE,
    maxPages: 5,
  });

  await closeCompletedInProgress(submissions, kind);
  const active = findLatestActive(submissions, kind, true);
  if (!active) return "fresh";

  const choice = hasAttempts(active) ? await askContinue() : ("continue" as const);
  if (choice === "cancel") return "cancel";
  if (choice === "new") return "fresh";

  const resumed = await fetchResumedSession(active.submission_id);
  if (!resumed) return "fresh";

  applyResumedSession(setSessionQuestions, resumed);
  return "resumed";
};

export const resolveSetUnfinishedStart = async (options: {
  preferredSetName: string;
  askContinue: () => Promise<ContinueSessionChoice>;
  setSessionQuestions: SetSessionQuestions;
}): Promise<StartResumeResult> => {
  const { preferredSetName, askContinue, setSessionQuestions } = options;
  const submissions = await getSubmissionHistory(undefined, {
    pageSize: SUBMISSION_PAGE_SIZE,
    maxPages: 5,
  });

  await closeCompletedInProgress(submissions, "set");

  const unfinished = submissions.filter(
    (submission) => isActiveInProgress(submission, "set") && !isFullyAttempted(submission)
  );

  const matching =
    unfinished.find((submission) => matchesSetSubmission(submission, preferredSetName)) ?? null;
  const otherWithAttempts =
    unfinished.find(
      (submission) => !matchesSetSubmission(submission, preferredSetName) && hasAttempts(submission)
    ) ?? null;

  const candidate = matching ?? otherWithAttempts;
  if (!candidate) return "fresh";

  const choice = matching && !hasAttempts(matching) ? ("continue" as const) : await askContinue();
  if (choice === "cancel") return "cancel";
  if (choice === "new") return "fresh";

  const resumed = await fetchResumedSession(candidate.submission_id);
  if (!resumed) return "fresh";

  applyResumedSession(setSessionQuestions, resumed);
  return "resumed";
};
