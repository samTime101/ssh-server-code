import React, { createContext, useState } from "react"; //useContext,
import { useAuth } from "@/hooks/useAuth.tsx";
import { getQuestions, getNextPageQuestions } from "@/services/user/question-service";
import { getAllBookmarkIds } from "@/services/user/bookmark-service";
import type { Question, QuestionPaginationMeta, FetchQuestionsPayload } from "@/types/question";
import {
  clampExamMinutes,
  clampQuestionCount,
  MAX_EXAM_MINUTES,
  MIN_EXAM_MINUTES,
  shuffleQuestions,
} from "@/utils/examModeUtils";

export const QuestionContext = createContext<any>(null);

const MIN_SESSION_SECONDS = MIN_EXAM_MINUTES * 60;
const MAX_SESSION_SECONDS = MAX_EXAM_MINUTES * 60;

const clampSessionSeconds = (seconds: number) =>
  Math.min(MAX_SESSION_SECONDS, Math.max(MIN_SESSION_SECONDS, Math.floor(seconds)));

const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  const [selectedCategoriesId, setSelectedCategoriesId] = useState<string[]>([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string[]>([]);
  const [selectedSubSubCategoryId, setSelectedSubSubCategoryId] = useState<string[]>([]);
  const [questionData, setQuestionData] = useState<Question[]>([]);
  const [questionPagination, setQuestionPagination] = useState<QuestionPaginationMeta | null>(null);
  const [currentSubmissionId, setCurrentSubmissionId] = useState<string | null>(null);
  const [lastFetchPayload, setLastFetchPayload] = useState<FetchQuestionsPayload | null>(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [sessionTimerSeconds, setSessionTimerSeconds] = useState(30 * 60);
  const [sessionQuestionLimit, setSessionQuestionLimit] = useState(20);
  const [sessionEndsAtMs, setSessionEndsAtMs] = useState<number | null>(null);
  const [isExamModeEnabled, setIsExamModeEnabled] = useState(false);

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
      } else {
        setQuestionData([]);
        setQuestionPagination(null);
        setCurrentSubmissionId(null);
      }
    } catch (e) {
      console.error(e);
      setQuestionData([]);
      setQuestionPagination(null);
      setCurrentSubmissionId(null);
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

  const resetQuestionSelection = () => {
    setSelectedCategoriesId([]);
    setSelectedSubCategoryId([]);
    setSelectedSubSubCategoryId([]);
    setCurrentSubmissionId(null);
  };

  const setSessionQuestions = (questions: Question[], submissionId?: string | null) => {
    setQuestionData(questions);
    setQuestionPagination(null);
    setCurrentSubmissionId(submissionId ?? null);
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
        handleCategorySelection,
        selectedSubCategoryId,
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
        sessionTimerSeconds,
        sessionQuestionLimit,
        sessionEndsAtMs,
        isExamModeEnabled,
        setIsExamModeEnabled,
        configureSessionTimer,
        configureSessionQuestionLimit,
        startSessionTimer,
        clearSessionTimer,
        resetQuestionSelection,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionProvider;
