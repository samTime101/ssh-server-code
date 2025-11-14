export interface Question {
  id: string;
  question_text: string;
  description: string;
  option_type: string;
  options: { label: string; text: string }[];
  difficulty: string;
  category: string;
  sub_categories_ids: string[];
  subSubCategory: string[];
  createdAt: string;
  updatedAt: string;
}
