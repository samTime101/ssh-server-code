import React, { createContext, useState } from "react"; //useContext,
import { useAuth } from "@/hooks/useAuth.tsx";
import { getQuestions, getNextPageQuestions } from "@/services/user/question-service";
import type { Question, QuestionPaginationMeta, FetchQuestionsPayload } from "@/types/question";

export const QuestionContext = createContext<any>(null);

const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  const [selectedCategoriesId, setSelectedCategoriesId] = useState<string[]>([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string[]>([]);
  const [selectedSubSubCategoryId, setSelectedSubSubCategoryId] = useState<string[]>([]);
  const [questionData, setQuestionData] = useState<Question[]>([]);
  const [questionPagination, setQuestionPagination] = useState<QuestionPaginationMeta | null>(null);
  const [lastFetchPayload, setLastFetchPayload] = useState<FetchQuestionsPayload | null>(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

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
        questionData,
        questionPagination,
        isFetchingNextPage,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionProvider;
