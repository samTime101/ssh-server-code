export interface Attempt {
  subcategories: string[];
  categories: string[];
  question_text: string;
  is_correct: boolean;
  selected_answers: string[];
  selected_options_labels: string[];
}
