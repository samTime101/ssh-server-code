import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";

interface FetchQuestionsPayload {
  category_ids: string[];
  sub_category_ids: string[];
  subSubCategoryId: string[];
  wrong_only?: boolean;
}

export const getCategories = async (token: string) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.getCategoriesWithHierarchy, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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

export const getQuestions = async (payload: FetchQuestionsPayload, token: string) => {
  console.log("the category payload", payload);
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.selectQuestions, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
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

export const attemptQuestion = async (
  questionId: string,
  selectedOptions: string[],
  token: string
) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.attemptQuestion,
      {
        question: questionId,
        selected_answers: selectedOptions,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
