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

export const getProgressClasses = (status: QuestionProgressStatus) =>
  status === "correct"
    ? "border-green-600 bg-green-100 text-green-700"
    : status === "incorrect"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : "border-border bg-muted text-muted-foreground";
