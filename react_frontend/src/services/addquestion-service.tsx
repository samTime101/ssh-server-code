import type { AuthToken } from "@/types/auth";

const API_URL = "http://localhost:8000";

// Types
// export interface AnswerOption {
//   id: string;
//   text: string;
//   isCorrect: boolean;
// }

// export interface Option{
//   optionId: string;
//   text: string;
// }

export interface Category {
  id: string;
  name: string;
  subCategories?: Category[];
}

// export interface QuestionFormData {
//   title: string;
//   description: string;
//   category: string;
//   subCategory: string;
//   subSubCategory: string;
//   answerType: 'single' | 'multiple';
//   answers: AnswerOption[];
// }

// Define types for the API request
interface Option {
  optionId: string;
  text: string;
}

interface ApiQuestionData {
  questionText: string;
  questionType: 'single' | 'multiple';
  options: Option[];
  correctAnswers: string[];
  difficulty: string;
  categoryId: string;
  subCategoryId: string[];
  subSubCategoryId: string[];
  description?: string;
}

export interface CreateQuestionResponse {
  message: string;
  category: Category;
}

export const createQuestion = async (
  questionData: ApiQuestionData,
  token: AuthToken
): Promise<CreateQuestionResponse> => {
  const response = await fetch(`${API_URL}/api/create/question/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access}`,
    },
    body: JSON.stringify({ questionData }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create questions");
  }

  return response.json();
};
