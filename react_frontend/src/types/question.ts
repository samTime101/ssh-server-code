export interface Question {
  id: string;
  question_text: string;
  description: string;
  option_type: string;
  options: { optionId: string; text: string }[];
  difficulty: string;
  category: string;
  sub_category: string[];
  subSubCategory: string[];
  createdAt: string;
  updatedAt: string;
  image_url?: string;
}
