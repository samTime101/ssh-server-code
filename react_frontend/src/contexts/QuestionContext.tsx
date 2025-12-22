import React, { createContext, useState } from "react"; //useContext,
import { useAuth } from "@/hooks/useAuth.tsx";
import { getQuestions } from "@/services/user/question-service";

export const QuestionContext = createContext<any>(null);

const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  const [selectedCategoriesId, setSelectedCategoriesId] = useState<string[]>([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string[]>([]);
  const [selectedSubSubCategoryId, setSelectedSubSubCategoryId] = useState<string[]>([]);
  const [questionData, setQuestionData] = useState<any>([]);

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
      const payload = {
        category_ids: selectedCategoriesId,
        sub_category_ids: selectedSubCategoryId,
        subSubCategoryId: selectedSubSubCategoryId,
        wrong_only,
      };
      const response = await getQuestions(payload);
      console.log("Questions fetched in context:", response);
      //   if (response) {
      //     setQuestionData(response);
      //   }
      setQuestionData(response);
    } catch (e) {
      console.error(e);
      setQuestionData([]);
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
        questionData,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionProvider;
