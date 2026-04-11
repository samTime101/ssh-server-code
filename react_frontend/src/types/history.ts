export interface Attempt {
  subcategories: string[];
  categories: string[];
  question_text: string;
  is_correct: boolean;
  selected_answers: string[];
  selected_options_labels: string[];
}

export interface SubmissionHistoryItem {
  submission_id: string;
  status: string;
  attempts: Attempt[];
}

export interface PaginatedSubmissionHistory {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubmissionHistoryItem[];
}

export type SubmissionHistoryResponse = PaginatedSubmissionHistory | SubmissionHistoryItem[];
