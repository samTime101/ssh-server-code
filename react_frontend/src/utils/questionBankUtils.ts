import type { QuestionBankAnalytics } from "@/types/analytics";

type QuestionBankProgress = {
  total: number;
  attempted: number;
  correct: number;
  incorrect: number;
  percentComplete: number;
  greenEnd: number;
  redEnd: number;
};

export const getQuestionBankProgress = (
  analytics: QuestionBankAnalytics | null | undefined
): QuestionBankProgress => {
  const total = analytics?.total_questions ?? 0;
  const attempted = analytics?.unique_questions_attempted ?? 0;
  const correct = analytics?.latest_correct_attempts ?? 0;
  const incorrect = analytics?.latest_incorrect_attempts ?? 0;
  const coveragePercent = analytics?.questions_coverage_percent ?? 0;

  const percentComplete = total > 0 ? (attempted / total) * 100 : coveragePercent;
  const greenEnd = total > 0 ? (correct / total) * 100 : 0;
  const redEnd = total > 0 ? ((correct + incorrect) / total) * 100 : 0;

  return {
    total,
    attempted,
    correct,
    incorrect,
    percentComplete,
    greenEnd,
    redEnd,
  };
};
