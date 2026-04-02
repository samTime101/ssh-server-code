import type { QuestionSetQuestion } from "@/types/questionset";

export const extractQuestionIds = (questions: QuestionSetQuestion[]): string[] => {
  return questions.map((question) => question.id).filter(Boolean);
};
