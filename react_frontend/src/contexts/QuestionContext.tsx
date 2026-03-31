import React, { createContext, useState } from "react"; //useContext,
import { useAuth } from "@/hooks/useAuth.tsx";
import { getQuestions, getNextPageQuestions } from "@/services/user/question-service";
import type { Question, QuestionPaginationMeta, FetchQuestionsPayload } from "@/types/question";

export const QuestionContext = createContext<any>(null);

const MIN_SESSION_SECONDS = 1;
const MAX_SESSION_SECONDS = 180 * 60;

const clampSessionSeconds = (seconds: number) =>
  Math.min(MAX_SESSION_SECONDS, Math.max(MIN_SESSION_SECONDS, Math.floor(seconds)));

const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  const [selectedCategoriesId, setSelectedCategoriesId] = useState<string[]>([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string[]>([]);
  const [selectedSubSubCategoryId, setSelectedSubSubCategoryId] = useState<string[]>([]);
  const [questionData, setQuestionData] = useState<Question[]>([]);
  const [questionPagination, setQuestionPagination] = useState<QuestionPaginationMeta | null>(null);
  const [lastFetchPayload, setLastFetchPayload] = useState<FetchQuestionsPayload | null>(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [sessionTimerSeconds, setSessionTimerSeconds] = useState(30 * 60);
  const [sessionEndsAtMs, setSessionEndsAtMs] = useState<number | null>(null);

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

      const response = await getQuestions(payload);
      console.log("Questions fetched in context:", response);

      if (response) {
        setQuestionData(response.results);
        setQuestionPagination({
          count: response.count,
          next: response.next,
          total_pages: response.total_pages,
        });
      } else {
        setQuestionData([]);
        setQuestionPagination(null);
      }
    } catch (e) {
      console.error(e);
      setQuestionData([]);
      setQuestionPagination(null);
    }
  };

  const fetchNextPage = async () => {
    if (!questionPagination?.next || !lastFetchPayload || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const response = await getNextPageQuestions(questionPagination.next, lastFetchPayload);
      console.log("Next page fetched in context:", response);

      if (response) {
        setQuestionData((prev) => [...prev, ...response.results]);
        setQuestionPagination({
          count: response.count,
          next: response.next,
          total_pages: response.total_pages,
        });
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
    setSessionTimerSeconds(clampSessionSeconds(totalSeconds));
  };

  const startSessionTimer = (totalSeconds: number) => {
    const clampedSeconds = clampSessionSeconds(totalSeconds);
    setSessionTimerSeconds(clampedSeconds);
    setSessionEndsAtMs(Date.now() + clampedSeconds * 1000);
  };

  const clearSessionTimer = () => {
    setSessionEndsAtMs(null);
  };

  const setSessionQuestions = (questions: Question[]) => {
    setQuestionData(questions);
    setQuestionPagination(null);
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
        questionData,
        questionPagination,
        isFetchingNextPage,
        sessionTimerSeconds,
        sessionEndsAtMs,
        configureSessionTimer,
        startSessionTimer,
        clearSessionTimer,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionProvider;
