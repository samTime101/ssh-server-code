import type { QuestionSet, QuestionSetQuestion } from "@/types/questionset";

const toSafeString = (value: unknown): string => (typeof value === "string" ? value : "");

const toQuestion = (raw: unknown): QuestionSetQuestion | null => {
  if (typeof raw === "string") {
    return { id: raw, question_text: "" };
  }

  if (!raw || typeof raw !== "object") return null;

  const candidate = raw as Record<string, unknown>;
  const id = toSafeString(candidate.id);
  if (!id) return null;

  return {
    id,
    question_text: toSafeString(candidate.question_text),
  };
};

export const normalizeQuestionSet = (raw: unknown): QuestionSet | null => {
  if (!raw || typeof raw !== "object") return null;

  const candidate = raw as Record<string, unknown>;
  const id = toSafeString(candidate.id);
  const name = toSafeString(candidate.name);

  if (!id || !name) return null;

  const rawQuestions = Array.isArray(candidate.questions) ? candidate.questions : [];
  const questions = rawQuestions
    .map((question) => toQuestion(question))
    .filter((question): question is QuestionSetQuestion => question !== null);

  return {
    id,
    name,
    description: toSafeString(candidate.description),
    questions,
  };
};

export const normalizeQuestionSetList = (raw: unknown): QuestionSet[] => {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object"
      ? ((raw as Record<string, unknown>).results ?? (raw as Record<string, unknown>).sets)
      : [];

  if (!Array.isArray(list)) return [];

  return list
    .map((item) => normalizeQuestionSet(item))
    .filter((item): item is QuestionSet => item !== null);
};

export const extractQuestionIds = (questions: QuestionSetQuestion[]): string[] => {
  return questions.map((question) => question.id).filter(Boolean);
};
