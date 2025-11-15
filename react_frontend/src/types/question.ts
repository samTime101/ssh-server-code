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
  image_url?: string;
}

export interface QuestionAttemptState {
  selectedOption?: string;
  selectedOptions: string[];
  isAttempted: boolean;
  isCorrect?: boolean;
  feedback?: string;
  correctOptions?: string[];
}