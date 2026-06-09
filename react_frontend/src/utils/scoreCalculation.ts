import type { QuestionAttemptState } from "@/types/question";

export interface ScoreData {
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions: number;
  totalPoints: number;
}

export const calculateScore = (
  attempts: { [id: string]: QuestionAttemptState },
  totalQuestions: number
): ScoreData => {
  const attemptValues = Object.values(attempts);
  
  const attemptedQuestions = attemptValues.filter((a) => a.isAttempted).length;
  const correctAnswers = attemptValues.filter(
    (a) => a.isAttempted && a.isCorrect === true
  ).length;
  const incorrectAnswers = attemptValues.filter(
    (a) => a.isAttempted && a.isCorrect === false
  ).length;
  const unattemptedQuestions = totalQuestions - attemptedQuestions;

  const totalPoints = correctAnswers + (incorrectAnswers * -0.25);

  return {
    totalQuestions,
    attemptedQuestions,
    correctAnswers,
    incorrectAnswers,
    unattemptedQuestions,
    totalPoints,
  };
};
