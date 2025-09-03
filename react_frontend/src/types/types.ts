// SAMIP REGMI
// SEP 3
// -----------------------
export interface User {
  userId: string; 
  email: string;
  username: string;
  phonenumber: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
}

export interface AuthToken {
  access: string;
  refresh: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  question_count: number;
  subCategories: SubCategory[];
}

export interface SubCategory {
  subCategoryId: number;
  subCategoryName: string;
  question_count: number;
  subSubCategories?: SubSubCategory[];
}

export interface SubSubCategory {
  subSubCategoryId: number;
  subSubCategoryName: string;
}

export interface Option {
  optionId: string;
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: Option[];
  correctAnswers: string[];
  difficulty: string;
  category: string;
  subCategory: string[];
  subSubCategory: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionsResponse {
  questions: Question[];
}
export interface QuestionsPageProps {
  selectedCategories: number[];
  selectedSubCategories?: number[];
  selectedSubSubCategories?: number[];
}
//-------------------------------