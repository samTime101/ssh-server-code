export interface QuestionSetQuestion {
  id: string;
  question_text: string;
}

export interface QuestionSetQuestionApi {
  id: string;
  question_text?: string;
}

export interface QuestionSet {
  id: string;
  name: string;
  description: string;
  questions: QuestionSetQuestion[];
}

export interface QuestionSetApi {
  id: string;
  name: string;
  description: string;
  question_count?: number | string;
  questions: Array<string | QuestionSetQuestionApi>;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedQuestionSetApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: QuestionSetApi[];
  current_page?: number;
  total_pages?: number;
}

export interface QuestionSetPayload {
  name: string;
  description: string;
  question_ids: string[];
  constraint?: string | null;
}

export interface QuestionSetListResponse {
  sets: QuestionSet[];
}

export interface SelectableQuestion {
  id: string;
  question_text: string;
  status?: "approved" | "pending" | "rejected";
  category_names?: string[];
  subcategory_names?: string[];
}

export interface SelectableQuestionApi {
  id: string;
  question_text?: string;
  description?: string;
  status?: "approved" | "pending" | "rejected";
  category_names?: string[];
  subcategory_names?: string[];
}

export interface SelectableQuestionListResponse {
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: SelectableQuestion[];
}

export interface PaginatedSelectableQuestionApiResponse {
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: SelectableQuestionApi[];
}
