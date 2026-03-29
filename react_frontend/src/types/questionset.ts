export interface QuestionSetQuestion {
  id: string;
  question_text: string;
}

export interface QuestionSet {
  id: string;
  name: string;
  description: string;
  questions: QuestionSetQuestion[];
}

export interface QuestionSetPayload {
  name: string;
  description: string;
  question_ids: string[];
}

export interface QuestionSetListResponse {
  sets: QuestionSet[];
}

export interface SelectableQuestion {
  id: string;
  question_text: string;
  status?: "approved" | "pending" | "rejected";
}

export interface SelectableQuestionListResponse {
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: SelectableQuestion[];
}
