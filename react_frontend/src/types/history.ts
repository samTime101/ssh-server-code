export interface Attempt {
  subcategories: string[];
  categories: string[];
  question_text: string;
  is_correct: boolean;
  selected_answers: string[];
  selected_options_labels: string[];
  attempted_at?: string;
}

export interface SubmissionHistoryItem {
  submission_id: string;
  status: string;
  type?: string;
  attempts: Attempt[];
  started_at?: string | null;
  submitted_at?: string | null;
}

export interface SubmissionMetrics {
  total: number;
  correct: number;
  incorrect: number;
}

export interface SubmissionOverview {
  totalSubmissions: number;
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
}

export interface PaginatedSubmissionHistory {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubmissionHistoryItem[];
}

export type SubmissionHistoryResponse = PaginatedSubmissionHistory | SubmissionHistoryItem[];
