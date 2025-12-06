import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { CreateQuestionPayload, CreateQuestionResponse } from "@/types/question";

export const createQuestion = async (
  questionData: CreateQuestionPayload,
  images: { question: File | null; description: File | null },
  token: string
): Promise<CreateQuestionResponse> => {
  console.log(JSON.stringify(questionData));
  console.log(token);

  const formData = new FormData();
  formData.append("data", JSON.stringify(questionData));
  if (images.question) {
    formData.append("question_image", images.question);
  }
  if (images.description) {
    formData.append("description_image", images.description);
  }
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.adminQuestions + "/", // Django expects trailing slash for POST Requests
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create questions");
  }
};

export const updateQuestion = async (
  questionId: string,
  questionData: CreateQuestionPayload,
  images: { question: File | null; description: File | null },
  token: string
): Promise<CreateQuestionResponse> => {
  console.log(JSON.stringify(questionData));
  console.log(token);
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
      `${API_ENDPOINTS.adminQuestions}/${questionId}/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update question", error);
    throw new Error("Failed to update question");
  }
};
