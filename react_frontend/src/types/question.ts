export interface Question {
  id: string;
  question_text: string;
  description: string;
  option_type: string;
  options: { label: string; text: string }[];
  difficulty: string;
  category: string;
  sub_category: string[];
  subSubCategory: string[];
  createdAt: string;
  updatedAt: string;
  question_image_url?: string;
  description_image_url?: string;
  contributor: string;
  contributor_specialization: string;
}

export interface PaginatedQuestionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
  current_page: number;
  total_pages: number;
}

export interface QuestionPaginationMeta {
  count: number;
  next: string | null;
  total_pages: number;
}

export interface FetchQuestionsPayload {
  category_ids: string[];
  sub_category_ids: string[];
  subSubCategoryId: string[];
  wrong_only?: boolean;
}

export interface QuestionAttemptState {
  selectedOption?: string;
  selectedOptions: string[];
  isAttempted: boolean;
  feedback?: string;
  correctOptions?: string[];
}

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
  sub_categories: string[];
  // subSubCategoryIds: string[];
  description?: string;
  contributor?: string;
  contributor_specialization?: string;
}

import type { Category } from "@/types/category";
export interface CreateQuestionResponse {
  message: string;
  category: Category;
}

export interface QuestionFormData {
  questionText: string;
  description: string;
  categoryIds: string[];
  subCategories: string[];
  optionType: "single" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  options: Array<{
    label: string;
    text: string;
    isCorrect: boolean;
  }>;
  contributor?: string;
  contributorSpecialization?: string;
}

export interface UseQuestionFormProps {
  mode: "create" | "edit";
  initialData?: Partial<QuestionFormData>;
  questionId?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
}
