import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { PaginatedQuestionsResponse, FetchQuestionsPayload } from "@/types/question";

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

export const getQuestions = async (
  payload: FetchQuestionsPayload
): Promise<PaginatedQuestionsResponse | null> => {
  console.log("the category payload", payload);
  const { wrong_only, ...bodyPayload } = payload;
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.selectQuestions, bodyPayload, {
      params: {
        wrong_only: wrong_only,
        non_attempted: false,
      },
    });

    if (!response) {
      return null;
    }

    return response.data as PaginatedQuestionsResponse;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return null;
  }
};

export const getNextPageQuestions = async (
  nextUrl: string,
  payload: FetchQuestionsPayload
): Promise<PaginatedQuestionsResponse | null> => {
  const { wrong_only, ...bodyPayload } = payload;
  try {
    // nextUrl is the full URL from the paginated response (e.g. "http://api.../questions/select/?page=2")
    const response = await axiosInstance.post(nextUrl, bodyPayload, {
      params: { wrong_only: wrong_only, non_attempted: false },
    });

    if (!response) {
      return null;
    }

    return response.data as PaginatedQuestionsResponse;
  } catch (error) {
    console.error("Error fetching next page of questions:", error);
    return null;
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
