export const MIN_EXAM_QUESTIONS = 5;
export const MAX_EXAM_QUESTIONS = 50;
export const EXAM_QUESTION_STEP = 5;

export const MIN_EXAM_MINUTES = 1;
export const MAX_EXAM_MINUTES = 120;
export const EXAM_MINUTES_STEP = 5;

export const clampQuestionCount = (count: number) => {
  if (!Number.isFinite(count)) return MIN_EXAM_QUESTIONS;

  const snappedCount = Math.round(count / EXAM_QUESTION_STEP) * EXAM_QUESTION_STEP;
  return Math.min(MAX_EXAM_QUESTIONS, Math.max(MIN_EXAM_QUESTIONS, snappedCount));
};

export const clampExamMinutes = (minutes: number) => {
  if (!Number.isFinite(minutes)) return MIN_EXAM_MINUTES;
  return Math.min(MAX_EXAM_MINUTES, Math.max(MIN_EXAM_MINUTES, Math.floor(minutes)));
};

export const getEffectiveQuestionCount = (configuredCount: number, availableCount: number) =>
  Math.max(0, Math.min(configuredCount, availableCount));

export const shuffleQuestions = <T>(items: T[]): T[] => {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};
