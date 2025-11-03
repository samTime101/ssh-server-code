export interface Question {
  id: string;
  questionText: string;
  description: string;
  questionType: string;
  options: { optionId: string; text: string }[];
  difficulty: string;
  category: string;
  subCategory: string[];
  subSubCategory: string[];
  createdAt: string;
  updatedAt: string;
}
