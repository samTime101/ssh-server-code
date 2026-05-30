export interface FeedbackEntry {
  id: string;
  email: string;
  feedback: string;
  created_at: string;
  updated_at?: string;
}

export interface FeedbackListResponse {
  count: number;
  total_pages: number;
  current_page?: number;
  next: string | null;
  previous: string | null;
  results: FeedbackEntry[];
}
