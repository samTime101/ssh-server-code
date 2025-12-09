import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";

interface FetchQuestionsPayload {
  category_ids: string[];
  sub_category_ids: string[];
  subSubCategoryId: string[];
  wrong_only?: boolean;
}

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.getCategoriesWithHierarchy);

    if (!response) {
      return [];
    }
    console.log("Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getQuestions = async (payload: FetchQuestionsPayload) => {
  console.log("the category payload", payload);
  const { wrong_only, ...bodyPayload } = payload;
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.selectQuestions, bodyPayload, {
      params: {
        wrong_only: wrong_only || false,
      },
    });

    if (!response) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export const attemptQuestion = async (questionId: string, selectedOptions: string[]) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.attemptQuestion, {
      question: questionId,
      selected_answers: selectedOptions,
    });

    if (!response) {
      return null;
    }
    console.log("The response from attemptquestion is", response.data);
    return response.data;
  } catch (error) {
    console.error("Error attempting question:", error);
    return null;
  }
};
