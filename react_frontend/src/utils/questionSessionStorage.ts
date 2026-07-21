import type {
  FetchQuestionsPayload,
  Question,
  QuestionAttemptState,
  QuestionPaginationMeta,
} from "@/types/question";

const STORAGE_KEY = "sisani.question_session.v1";

export interface PersistedQuestionSession {
  selectedCategoriesId: string[];
  selectedSubCategoryId: string[];
  selectedSubSubCategoryId: string[];
  questionData: Question[];
  questionPagination: QuestionPaginationMeta | null;
  currentSubmissionId: string | null;
  lastFetchPayload: FetchQuestionsPayload | null;
  sessionAttemptCount: number;
  sessionAttemptResults: (boolean | null)[];
  sessionAttempts: Record<string, QuestionAttemptState>;
  sessionInstanceId: number;
  sessionWrongOnly: boolean;
  sessionTimerSeconds: number;
  sessionQuestionLimit: number;
  sessionEndsAtMs: number | null;
  isExamModeEnabled: boolean;
  mockExamEndsAtMs: number | null;
}

export function loadPersistedQuestionSession(): PersistedQuestionSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedQuestionSession;
  } catch {
    return null;
  }
}

export function persistQuestionSession(state: PersistedQuestionSession): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (e.g. private browsing quota) - safe to ignore.
  }
}

export function clearPersistedQuestionSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore - nothing to clear if storage is unavailable.
  }
}
