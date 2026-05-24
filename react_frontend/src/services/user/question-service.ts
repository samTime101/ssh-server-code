import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type {
  AttemptQuestionResponse,
  FetchQuestionsPayload,
  PaginatedQuestionsResponse,
  Question,
  SubmitSubmissionResponse,
} from "@/types/question";

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

export const attemptQuestion = async (
  submissionId: string,
  questionId: string,
  selectedOptions: string[]
): Promise<AttemptQuestionResponse | null> => {
  try {
    const response = await axiosInstance.post<AttemptQuestionResponse>(
      `${API_ENDPOINTS.attemptQuestion}${submissionId}/attempts/`,
      {
        question: questionId,
        selected_answers: selectedOptions,
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

export const submitSubmission = async (
  submissionId: string
): Promise<SubmitSubmissionResponse | null> => {
  try {
    const response = await axiosInstance.post<SubmitSubmissionResponse>(
      `${API_ENDPOINTS.attemptQuestion}${submissionId}/submit/`
    );

    if (!response) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error("Error submitting submission:", error);
    return null;
  }
};

export const getQuestionById = async (questionId: string): Promise<Question | null> => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.adminQuestions}${questionId}/`);
    if (!response) {
      return null;
    }
    return response.data as Question;
  } catch (error) {
    console.error("Error fetching question by id:", error);
    return null;
  }
};
