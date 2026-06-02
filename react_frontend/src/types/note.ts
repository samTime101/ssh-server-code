export interface QuestionNote {
  id: string;
  note: string;
}

export interface PaginatedNotesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: QuestionNote[];
}

export interface NotePayload {
  note: string;
}