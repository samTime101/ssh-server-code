import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";

interface FetchQuestionsPayload {
  categoryId: number[];
  subCategoryId: number[];
  subSubCategoryId: number[];
}

export const getCategories = async (token: string) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.getCategories, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      return [];
    }

    return response.data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getQuestions = async (payload: FetchQuestionsPayload, token: string) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.selectQuestions, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response) {
      return [];
    }

    return response.data.questions;
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
        questionId,
        selectedAnswers: selectedOptions,
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
    return response.data;
  } catch (error) {
    console.error("Error attempting question:", error);
    return null;
  }
};
