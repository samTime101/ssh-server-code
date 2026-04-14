import type {
  Attempt,
  SubmissionHistoryItem,
  SubmissionHistoryResponse,
  SubmissionMetrics,
  SubmissionOverview,
} from "@/types/history";

const isAttemptArray = (value: unknown): value is Attempt[] => {
  if (!Array.isArray(value)) return false;

  return value.every(
    (item) => typeof item === "object" && item !== null && "question_text" in item
  );
};

const normalizeSubmission = (submission: SubmissionHistoryItem): SubmissionHistoryItem => ({
  ...submission,
  attempts: Array.isArray(submission.attempts) ? submission.attempts : [],
});

export const getSubmissionItems = (
  data: SubmissionHistoryResponse | Attempt[] | null | undefined
): SubmissionHistoryItem[] => {
  if (!data) return [];

  if (Array.isArray(data)) {
    if (isAttemptArray(data)) {
      return [
        {
          submission_id: "legacy-submission",
          status: "submitted",
          attempts: data,
          started_at: null,
          submitted_at: null,
        },
      ];
    }

    return data.map(normalizeSubmission);
  }

  if (Array.isArray(data.results)) {
    return data.results.map(normalizeSubmission);
  }

  return [];
};

export const formatHistoryDateTime = (value?: string | null): string => {
  if (!value) return "-";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getSubmissionMetrics = (submission: SubmissionHistoryItem): SubmissionMetrics => {
  const total = submission.attempts.length;
  const correct = submission.attempts.filter((attempt) => attempt.is_correct).length;

  return {
    total,
    correct,
    incorrect: total - correct,
  };
};

export const getSubmissionOverview = (submissions: SubmissionHistoryItem[]): SubmissionOverview => {
  const totalSubmissions = submissions.length;
  const totalAttempts = submissions.reduce(
    (sum, submission) => sum + submission.attempts.length,
    0
  );
  const correctAttempts = submissions.reduce(
    (sum, submission) => sum + getSubmissionMetrics(submission).correct,
    0
  );

  return {
    totalSubmissions,
    totalAttempts,
    correctAttempts,
    incorrectAttempts: totalAttempts - correctAttempts,
  };
};
