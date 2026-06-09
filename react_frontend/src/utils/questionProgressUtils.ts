import type { Question, QuestionAttemptState } from "@/types/question";

export type QuestionProgressStatus = "pending" | "correct" | "incorrect";

export const getQuestionProgressStatus = (
  questionData: Question[] | undefined,
  attempts: Record<string, QuestionAttemptState>,
  index: number
): QuestionProgressStatus => {
  const question = questionData?.[index];
  if (!question) return "pending";

  const attempt = attempts[question.id];
  if (!attempt?.isAttempted) return "pending";
  if (attempt.isCorrect === true) return "correct";
  if (attempt.isCorrect === false) return "incorrect";
  return "pending";
};

export const getProgressClasses = (status: QuestionProgressStatus) => {
  const bubbleClasses =
    status === "correct"
      ? "border-green-600 bg-green-500 text-white"
      : status === "incorrect"
        ? "border-red-600 bg-red-500 text-white"
        : "border-border bg-muted text-muted-foreground";

  const lineClasses =
    status === "correct"
      ? "bg-green-500/70"
      : status === "incorrect"
        ? "bg-red-500/70"
        : "bg-border";

  return { bubbleClasses, lineClasses };
};
