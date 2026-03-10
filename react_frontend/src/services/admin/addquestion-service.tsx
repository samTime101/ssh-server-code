import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { CreateQuestionPayload, CreateQuestionResponse } from "@/types/question";

export const fetchQuestions = async (
  page: number,
  pageSize: number,
  categoryId?: string,
  subCategoryId?: string
) => {
  try {
    const params: Record<string, string | number> = { page, page_size: pageSize };
    if (categoryId) params.category_id = categoryId;
    if (subCategoryId) params.sub_category_id = subCategoryId;
    const response = await axiosInstance.get(API_ENDPOINTS.adminQuestions, { params });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch questions");
  }
};

export const searchQuestions = async (searchText: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.adminQuestions, {
    params: { search: searchText },
  });
  return response.data;
};

export const createQuestion = async (
  questionData: CreateQuestionPayload,
  images: { question: File | null; description: File | null }
): Promise<CreateQuestionResponse> => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(questionData));
  if (images.question) {
    formData.append("question_image", images.question);
  }
  if (images.description) {
    formData.append("description_image", images.description);
  }
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.adminQuestions, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateQuestion = async (
  questionId: string,
  questionData: CreateQuestionPayload,
  images: { question: File | null; description: File | null }
): Promise<CreateQuestionResponse> => {
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(questionData));
    if (images.question) {
      formData.append("question_image", images.question);
    }
    if (images.description) {
      formData.append("description_image", images.description);
    }
    const response = await axiosInstance.putForm(
      `${API_ENDPOINTS.adminQuestions}${questionId}/`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update question", error);
    throw error;
  }
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.adminQuestions}${questionId}/`);
  } catch (error) {
    console.error("Failed to delete question", error);
    throw new Error("Failed to delete question");
  }
};
