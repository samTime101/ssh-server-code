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
  type: string;
  submission_id: string;
  status: string;
  attempts: Attempt[];
  selected_question_ids?: string[];
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
  total_pages?: number;
  current_page?: number;
}

export interface PaginatedSubmissionHistoryResult extends PaginatedSubmissionHistory {
  total_pages: number;
  current_page: number;
}

export interface FetchSubmissionHistoryPageOptions {
  type?: string;
  signal?: AbortSignal;
}

export interface GetSubmissionHistoryOptions {
  pageSize?: number;
  maxPages?: number;
  signal?: AbortSignal;
}

export type SubmissionHistoryResponse = PaginatedSubmissionHistory | SubmissionHistoryItem[];
