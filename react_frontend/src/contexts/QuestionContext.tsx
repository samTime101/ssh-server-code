import React, { createContext, useContext, useState } from "react";
import { useAuth } from "@/hooks/useAuth.tsx";
import { getQuestions } from "@/services/user/questionService.ts";

export const QuestionContext = createContext<any>(null);

const QuestionProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();

  const [selectedCategoriesId, setSelectedCategoriesId] = useState<number[]>([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number[]>([]);
  const [selectedSubSubCategoryId, setSelectedSubSubCategoryId] = useState<number[]>([]);
  const [questionData, setQuestionData] = useState<any>([]);

  const handleCategorySelection = (categoryId: number) => {
    // Filters and removes duplicates and adds the selected category ID
    setSelectedCategoriesId((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSubCategorySelection = (subCategoryId: number) => {
    // Toggles selection of sub-category IDs
    setSelectedSubCategoryId((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const handleSubSubCategorySelection = (subSubCategoryId: number) => {
    // Toggles selection of sub-sub-category IDs
    setSelectedSubSubCategoryId((prev) =>
      prev.includes(subSubCategoryId)
        ? prev.filter((id) => id !== subSubCategoryId)
        : [...prev, subSubCategoryId]
    );
  };

  const fetchQuestions = async () => {
    try {
      if (!token) {
        console.error("No token available");
        return;
      }
      const payload = {
        categoryId: selectedCategoriesId,
        subCategoryId: selectedSubCategoryId,
        subSubCategoryId: selectedSubSubCategoryId,
      };
      const response = await getQuestions(payload, token);
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
