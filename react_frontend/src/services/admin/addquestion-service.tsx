import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/config/apiConfig";

// TODO: Refactor types and interfaces into separate files

export interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}

// Define types for the API request
interface Option {
  label: string;
  text: string;
  is_true: boolean;
}

export interface CreateQuestionPayload {
  question_text: string;
  option_type: "single" | "multiple";
  options: Option[];
  // correctAnswers: string[];
  difficulty: string;
  categoryId: number;
  sub_categories: string[];
  // subSubCategoryIds: string[];
  description?: string;
}

export interface CreateQuestionResponse {
  message: string;
  category: Category;
}

export const createQuestion = async (
  questionData: CreateQuestionPayload,
  questionImage: File | null,
  token: string
): Promise<CreateQuestionResponse> => {
  console.log(JSON.stringify(questionData));
  console.log(token);

  const formData = new FormData();
  formData.append("data", JSON.stringify(questionData));
  if (questionImage) {
    formData.append("image", questionImage);
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
  questionImage: File | null,
  token: string
): Promise<CreateQuestionResponse> => {
  console.log(JSON.stringify(questionData));
  console.log(token);
  try {
    const formData = new FormData();
    formData.append("data", JSON.stringify(questionData));
    if (questionImage) {
      formData.append("image", questionImage);
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
