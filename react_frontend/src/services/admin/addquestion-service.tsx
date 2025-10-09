import type { AuthToken } from "@/types/auth";
import axios from "axios";

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

export interface ApiQuestionData {
  questionText: string;
  questionType: 'single' | 'multiple';
  options: Option[];
  correctAnswers: string[];
  difficulty: string;
  categoryId: number;
  subCategoryIds: string[];
  subSubCategoryIds: string[];
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
  console.log(JSON.stringify(questionData));
  console.log(API_URL + '/api/create/question/');
  console.log(token.access);

  try {
    const response = await axios.post(
      API_URL + `/api/create/question/`,
      questionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create questions");
  }
};