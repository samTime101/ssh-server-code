import React, { createContext, useEffect, useState } from "react";
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
  clearExamTimer,
  clearMockTimer,
  getActiveExamTimer,
  setExamTimer,
  setMockTimer,
} from "@/utils/sessionTimerStorage";

export const QuestionContext = createContext<any>(null);

const MIN_SESSION_SECONDS = MIN_EXAM_MINUTES * 60;
const MAX_SESSION_SECONDS = MAX_EXAM_MINUTES * 60;

const clampSessionSeconds = (seconds: number) =>
  Math.min(MAX_SESSION_SECONDS, Math.max(MIN_SESSION_SECONDS, Math.floor(seconds)));

const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  const initialExamTimer = getActiveExamTimer();

  const [selectedCategoriesId, setSelectedCategoriesId] = useState<string[]>([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string[]>([]);
  const [selectedSubSubCategoryId, setSelectedSubSubCategoryId] = useState<string[]>([]);
  const [questionData, setQuestionData] = useState<Question[]>([]);
  const [questionPagination, setQuestionPagination] = useState<QuestionPaginationMeta | null>(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);
  const [lastFetchPayload, setLastFetchPayload] = useState<FetchQuestionsPayload | null>(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [sessionAttemptCount, setSessionAttemptCount] = useState(0);
  const [sessionAttemptResults, setSessionAttemptResults] = useState<(boolean | null)[]>([]);
  const [sessionAttempts, setSessionAttempts] = useState<Record<string, QuestionAttemptState>>({});
  const [sessionInstanceId, setSessionInstanceId] = useState(0);
  const [sessionWrongOnly, setSessionWrongOnly] = useState(false);
  const [sessionTimerSeconds, setSessionTimerSeconds] = useState(30 * 60);
  const [sessionQuestionLimit, setSessionQuestionLimit] = useState(20);
  const [sessionEndsAtMs, setSessionEndsAtMs] = useState<number | null>(
    () => initialExamTimer?.endsAtMs ?? null
  );
  const [isExamModeEnabled, setIsExamModeEnabled] = useState(() => Boolean(initialExamTimer));
  const [mockExamEndsAtMs, setMockExamEndsAtMs] = useState<number | null>(null);

  // Persist timer deadlines only (not question/attempt state).
  useEffect(() => {
    if (sessionEndsAtMs && currentSubmissionId && isExamModeEnabled) {
      setExamTimer(currentSubmissionId, sessionEndsAtMs);
      return;
    }
    if (!sessionEndsAtMs) {
      clearExamTimer();
    }
  }, [sessionEndsAtMs, currentSubmissionId, isExamModeEnabled]);

  useEffect(() => {
    if (mockExamEndsAtMs && currentSubmissionId) {
      setMockTimer(currentSubmissionId, mockExamEndsAtMs);
      return;
    }
    if (!mockExamEndsAtMs) {
      clearMockTimer();
    }
  }, [mockExamEndsAtMs, currentSubmissionId]);

  const handleCategorySelection = (categoryId: string) => {
    setSelectedCategoriesId((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSubCategorySelection = (subCategoryId: string) => {
    setSelectedSubCategoryId((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const handleSubSubCategorySelection = (subSubCategoryId: string) => {
    setSelectedSubSubCategoryId((prev) =>
      prev.includes(subSubCategoryId)
        ? prev.filter((id) => id !== subSubCategoryId)
        : [...prev, subSubCategoryId]
    );
  };

  const fetchQuestions = async (wrong_only?: boolean): Promise<string | null> => {
    try {
      if (!token) {
        console.error("No token available");
        return null;
      }
      const payload: FetchQuestionsPayload = {
        category_ids: selectedCategoriesId,
        sub_category_ids: selectedSubCategoryId,
        subSubCategoryId: selectedSubSubCategoryId,
        wrong_only,
      };
      setLastFetchPayload(payload);
      setSessionWrongOnly(Boolean(wrong_only));

      const [response, bookmarkIds] = await Promise.all([
        getQuestions(payload),
        getAllBookmarkIds(),
      ]);

      if (response) {
        const bookmarkSet = new Set(bookmarkIds);
        const rawQuestions = isExamModeEnabled
          ? shuffleQuestions(response.results)
          : response.results;

        const sessionQuestions = rawQuestions.map((q) => ({
          ...q,
          is_bookmarked: bookmarkSet.has(q.id),
        }));

        const submissionId = response.submission_id ?? null;
        setQuestionData(sessionQuestions);
        setQuestionPagination({
          count: response.count,
          next: response.next,
          total_pages: response.total_pages,
        });
        setCurrentSubmissionId(submissionId);
        setSessionAttemptCount(0);
        setSessionAttemptResults([]);
        setSessionAttempts({});
        setSessionInstanceId((prev) => prev + 1);
        return submissionId;
      }

      setQuestionData([]);
      setQuestionPagination(null);
      setCurrentSubmissionId(null);
      setSessionAttemptCount(0);
      setSessionAttemptResults([]);
      setSessionAttempts({});
      return null;
    } catch (e) {
      console.error(e);
      setQuestionData([]);
      setQuestionPagination(null);
      setCurrentSubmissionId(null);
      setSessionAttemptCount(0);
      setSessionAttemptResults([]);
      setSessionAttempts({});
      return null;
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

  const restoreSessionTimer = (endsAtMs: number) => {
    const remainingSeconds = Math.max(0, Math.round((endsAtMs - Date.now()) / 1000));
    setSessionTimerSeconds(Math.max(remainingSeconds, MIN_SESSION_SECONDS));
    setSessionEndsAtMs(endsAtMs);
  };

  const clearSessionTimer = () => {
    setSessionEndsAtMs(null);
    clearExamTimer();
  };

  const startMockExamTimer = (totalSeconds: number) => {
    setMockExamEndsAtMs(Date.now() + Math.max(0, Math.floor(totalSeconds)) * 1000);
  };

  const restoreMockExamTimer = (endsAtMs: number) => {
    setMockExamEndsAtMs(endsAtMs);
  };

  const clearMockExamTimer = () => {
    setMockExamEndsAtMs(null);
    clearMockTimer();
  };

  const resetQuestionSelection = () => {
    setQuestionData([]);
    setQuestionPagination(null);
    setCurrentSubmissionId(null);
    setSessionAttemptCount(0);
    setSessionAttemptResults([]);
    setSessionAttempts({});
    setMockExamEndsAtMs(null);
    setSessionEndsAtMs(null);
    clearExamTimer();
    clearMockTimer();
  };

  const setSessionQuestions = (
    questions: Question[],
    submissionId?: string | null,
    attemptsByQuestionId: Record<string, QuestionAttemptState> = {}
  ) => {
    const attemptEntries = Object.values(attemptsByQuestionId);
    setQuestionData(questions);
    setQuestionPagination(null);
    setCurrentSubmissionId(submissionId ?? null);
    setSessionAttemptCount(attemptEntries.length);
    setSessionAttemptResults(attemptEntries.map((attempt) => attempt.isCorrect ?? null));
    setSessionAttempts(attemptsByQuestionId);
    setSessionInstanceId((prev) => prev + 1);
    setSessionWrongOnly(false);
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
        restoreSessionTimer,
        clearSessionTimer,
        mockExamEndsAtMs,
        startMockExamTimer,
        restoreMockExamTimer,
        clearMockExamTimer,
        resetQuestionSelection,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionProvider;
