import React, { createContext, useEffect, useState } from "react"; //useContext,
import { useAuth } from "@/hooks/useAuth.tsx";
import { getQuestions, getNextPageQuestions } from "@/services/user/question-service";
import { getAllBookmarkIds } from "@/services/user/bookmark-service";
import type {
  Question,
  QuestionAttemptState,
  QuestionPaginationMeta,
  FetchQuestionsPayload,
} from "@/types/question";
import {
  clampExamMinutes,
  clampQuestionCount,
  MAX_EXAM_MINUTES,
  MIN_EXAM_MINUTES,
  shuffleQuestions,
} from "@/utils/examModeUtils";
import {
  clearPersistedQuestionSession,
  loadPersistedQuestionSession,
  persistQuestionSession,
  type PersistedQuestionSession,
} from "@/utils/questionSessionStorage";

export const QuestionContext = createContext<any>(null);

const MIN_SESSION_SECONDS = MIN_EXAM_MINUTES * 60;
const MAX_SESSION_SECONDS = MAX_EXAM_MINUTES * 60;

const clampSessionSeconds = (seconds: number) =>
  Math.min(MAX_SESSION_SECONDS, Math.max(MIN_SESSION_SECONDS, Math.floor(seconds)));

const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  const [persistedSession] = useState<PersistedQuestionSession | null>(() =>
    loadPersistedQuestionSession()
  );

  const [selectedCategoriesId, setSelectedCategoriesId] = useState<string[]>(
    () => persistedSession?.selectedCategoriesId ?? []
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string[]>(
    () => persistedSession?.selectedSubCategoryId ?? []
  );
  const [selectedSubSubCategoryId, setSelectedSubSubCategoryId] = useState<string[]>(
    () => persistedSession?.selectedSubSubCategoryId ?? []
  );
  const [questionData, setQuestionData] = useState<Question[]>(
    () => persistedSession?.questionData ?? []
  );
  const [questionPagination, setQuestionPagination] = useState<QuestionPaginationMeta | null>(
    () => persistedSession?.questionPagination ?? null
  );
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(
    () => persistedSession?.currentSubmissionId ?? null
  );
  const [lastFetchPayload, setLastFetchPayload] = useState<FetchQuestionsPayload | null>(
    () => persistedSession?.lastFetchPayload ?? null
  );
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [sessionAttemptCount, setSessionAttemptCount] = useState(
    () => persistedSession?.sessionAttemptCount ?? 0
  );
  const [sessionAttemptResults, setSessionAttemptResults] = useState<(boolean | null)[]>(
    () => persistedSession?.sessionAttemptResults ?? []
  );
  const [sessionAttempts, setSessionAttempts] = useState<Record<string, QuestionAttemptState>>(
    () => persistedSession?.sessionAttempts ?? {}
  );
  const [sessionInstanceId, setSessionInstanceId] = useState(
    () => persistedSession?.sessionInstanceId ?? 0
  );
  const [sessionWrongOnly, setSessionWrongOnly] = useState(
    () => persistedSession?.sessionWrongOnly ?? false
  );
  const [sessionTimerSeconds, setSessionTimerSeconds] = useState(
    () => persistedSession?.sessionTimerSeconds ?? 30 * 60
  );
  const [sessionQuestionLimit, setSessionQuestionLimit] = useState(
    () => persistedSession?.sessionQuestionLimit ?? 20
  );
  const [sessionEndsAtMs, setSessionEndsAtMs] = useState<number | null>(
    () => persistedSession?.sessionEndsAtMs ?? null
  );
  const [isExamModeEnabled, setIsExamModeEnabled] = useState(
    () => persistedSession?.isExamModeEnabled ?? false
  );
  const [mockExamEndsAtMs, setMockExamEndsAtMs] = useState<number | null>(
    () => persistedSession?.mockExamEndsAtMs ?? null
  );

  useEffect(() => {
    if (questionData.length === 0 && !currentSubmissionId) {
      clearPersistedQuestionSession();
      return;
    }

    persistQuestionSession({
      selectedCategoriesId,
      selectedSubCategoryId,
      selectedSubSubCategoryId,
      questionData,
      questionPagination,
      currentSubmissionId,
      lastFetchPayload,
      sessionAttemptCount,
      sessionAttemptResults,
      sessionAttempts,
      sessionInstanceId,
      sessionWrongOnly,
      sessionTimerSeconds,
      sessionQuestionLimit,
      sessionEndsAtMs,
      isExamModeEnabled,
      mockExamEndsAtMs,
    });
  }, [
    selectedCategoriesId,
    selectedSubCategoryId,
    selectedSubSubCategoryId,
    questionData,
    questionPagination,
    currentSubmissionId,
    lastFetchPayload,
    sessionAttemptCount,
    sessionAttemptResults,
    sessionAttempts,
    sessionInstanceId,
    sessionWrongOnly,
    sessionTimerSeconds,
    sessionQuestionLimit,
    sessionEndsAtMs,
    isExamModeEnabled,
    mockExamEndsAtMs,
  ]);

  const handleCategorySelection = (categoryId: string) => {
    // Filters and removes duplicates and adds the selected category ID
    setSelectedCategoriesId((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSubCategorySelection = (subCategoryId: string) => {
    // Toggles selection of sub-category IDs
    setSelectedSubCategoryId((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const handleSubSubCategorySelection = (subSubCategoryId: string) => {
    // Toggles selection of sub-sub-category IDs
    setSelectedSubSubCategoryId((prev) =>
      prev.includes(subSubCategoryId)
        ? prev.filter((id) => id !== subSubCategoryId)
        : [...prev, subSubCategoryId]
    );
  };

  const fetchQuestions = async (wrong_only?: boolean) => {
    try {
      if (!token) {
        console.error("No token available");
        return;
      }
      const payload: FetchQuestionsPayload = {
        category_ids: selectedCategoriesId,
        sub_category_ids: selectedSubCategoryId,
        subSubCategoryId: selectedSubSubCategoryId,
        wrong_only,
      };
      setLastFetchPayload(payload);
      setSessionWrongOnly(Boolean(wrong_only));

      // Fetch questions and bookmark IDs in parallel
      const [response, bookmarkIds] = await Promise.all([
        getQuestions(payload),
        getAllBookmarkIds(),
      ]);
      console.log("Questions fetched in context:", response);

      if (response) {
        const bookmarkSet = new Set(bookmarkIds);
        const rawQuestions = isExamModeEnabled
          ? shuffleQuestions(response.results)
          : response.results;

        // Stamp is_bookmarked onto every question so the question page
        // reflects the correct state without relying on the API to include it
        const sessionQuestions = rawQuestions.map((q) => ({
          ...q,
          is_bookmarked: bookmarkSet.has(q.id),
        }));

        setQuestionData(sessionQuestions);
        setQuestionPagination({
          count: response.count,
          next: response.next,
          total_pages: response.total_pages,
        });
        setCurrentSubmissionId(response.submission_id ?? null);
        setSessionAttemptCount(0);
        setSessionAttemptResults([]);
        setSessionAttempts({});
        setSessionInstanceId((prev) => prev + 1);
      } else {
        setQuestionData([]);
        setQuestionPagination(null);
        setCurrentSubmissionId(null);
        setSessionAttemptCount(0);
        setSessionAttemptResults([]);
        setSessionAttempts({});
      }
    } catch (e) {
      console.error(e);
      setQuestionData([]);
      setQuestionPagination(null);
      setCurrentSubmissionId(null);
      setSessionAttemptCount(0);
      setSessionAttemptResults([]);
      setSessionAttempts({});
    }
  };

  const fetchNextPage = async () => {
    if (!questionPagination?.next || !lastFetchPayload || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const [response, bookmarkIds] = await Promise.all([
        getNextPageQuestions(questionPagination.next, lastFetchPayload),
        getAllBookmarkIds(),
      ]);
      console.log("Next page fetched in context:", response);

      if (response) {
        const bookmarkSet = new Set(bookmarkIds);
        const rawQuestions = isExamModeEnabled
          ? shuffleQuestions(response.results)
          : response.results;

        const nextQuestions = rawQuestions.map((q) => ({
          ...q,
          is_bookmarked: bookmarkSet.has(q.id),
        }));

        setQuestionData((prev) => [...prev, ...nextQuestions]);
        setQuestionPagination({
          count: response.count,
          next: response.next,
          total_pages: response.total_pages,
        });
        if (response.submission_id) {
          setCurrentSubmissionId(response.submission_id);
        }
      }
    } catch (e) {
      console.error("Error fetching next page:", e);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  const configureSessionTimer = (minutes: number, seconds: number) => {
    const safeMinutes = Number.isFinite(minutes) ? Math.max(0, Math.floor(minutes)) : 0;
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const totalSeconds = safeMinutes * 60 + safeSeconds;
    const clampedMinutes = clampExamMinutes(Math.ceil(totalSeconds / 60));
    setSessionTimerSeconds(clampedMinutes * 60);
  };

  const configureSessionQuestionLimit = (count: number) => {
    setSessionQuestionLimit(clampQuestionCount(count));
  };

  const startSessionTimer = (totalSeconds: number) => {
    const clampedMinutes = clampExamMinutes(Math.ceil(totalSeconds / 60));
    const clampedSeconds = clampSessionSeconds(clampedMinutes * 60);
    setSessionTimerSeconds(clampedSeconds);
    setSessionEndsAtMs(Date.now() + clampedSeconds * 1000);
  };

  const clearSessionTimer = () => {
    setSessionEndsAtMs(null);
  };

  const startMockExamTimer = (totalSeconds: number) => {
    setMockExamEndsAtMs(Date.now() + Math.max(0, Math.floor(totalSeconds)) * 1000);
  };

  const clearMockExamTimer = () => {
    setMockExamEndsAtMs(null);
  };

  const resetQuestionSelection = () => {
    setSelectedCategoriesId([]);
    setSelectedSubCategoryId([]);
    setSelectedSubSubCategoryId([]);
    setQuestionData([]);
    setQuestionPagination(null);
    setCurrentSubmissionId(null);
    setSessionAttemptCount(0);
    setSessionAttemptResults([]);
    setSessionAttempts({});
    setMockExamEndsAtMs(null);
    clearPersistedQuestionSession();
  };

  const setSessionQuestions = (
    questions: Question[],
    submissionId?: string | null,
    attemptsCount: number = 0,
    attemptResults: (boolean | null)[] = []
  ) => {
    setQuestionData(questions);
    setQuestionPagination(null);
    setCurrentSubmissionId(submissionId ?? null);
    setSessionAttemptCount(Math.max(0, Math.floor(attemptsCount)));
    setSessionAttemptResults(attemptResults);
    setSessionAttempts({});
    setSessionInstanceId((prev) => prev + 1);
    setSessionWrongOnly(false);
    setMockExamEndsAtMs(null);
  };

  const setSessionAttempt = (questionId: string, attempt: QuestionAttemptState) => {
    setSessionAttempts((prev) => ({ ...prev, [questionId]: attempt }));
  };

  const updateQuestionBookmark = (questionId: string, isBookmarked: boolean) => {
    setQuestionData((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, is_bookmarked: isBookmarked } : q))
    );
  };

  return (
    <QuestionContext.Provider
      value={{
        selectedCategoriesId,
        setSelectedCategoriesId,
        handleCategorySelection,
        selectedSubCategoryId,
        setSelectedSubCategoryId,
        handleSubCategorySelection,
        selectedSubSubCategoryId,
        handleSubSubCategorySelection,
        fetchQuestions,
        fetchNextPage,
        setSessionQuestions,
        updateQuestionBookmark,
        questionData,
        questionPagination,
        currentSubmissionId,
        setCurrentSubmissionId,
        isFetchingNextPage,
        sessionAttemptCount,
        sessionAttemptResults,
        sessionAttempts,
        sessionInstanceId,
        sessionWrongOnly,
        setSessionAttemptCount,
        setSessionAttemptResults,
        setSessionAttempt,
        sessionTimerSeconds,
        sessionQuestionLimit,
        sessionEndsAtMs,
        isExamModeEnabled,
        setIsExamModeEnabled,
        configureSessionTimer,
        configureSessionQuestionLimit,
        startSessionTimer,
        clearSessionTimer,
        mockExamEndsAtMs,
        startMockExamTimer,
        clearMockExamTimer,
        resetQuestionSelection,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionProvider;
