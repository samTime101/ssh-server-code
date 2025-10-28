export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
  question_count: number;
}

export interface SubCategory {
  id: string;
  name: string;
  subSubCategories: SubSubCategory[];
  question_count: number;
}

export interface SubSubCategory {
  id: string;
  name: string;
  question_count?: number;
}

export interface GetCategoriesResponse {
  total_question_count?: number;
  categories: Category[];
}

export interface CreateCategoryResponse {
  message: string;
  category: { id: string; name: string };
}

export interface CreateSubCategoryResponse {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  question_count?: number;
}
export interface CreateSubSubCategoryResponse {
  id: string;
  name: string;
  subCategoryId: string;
  subCategoryName: string;
  question_count?: number;
}
