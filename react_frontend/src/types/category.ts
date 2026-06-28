export type CategoryStatus = "approved" | "pending" | "rejected";

export interface Category {
  id: string;
  name: string;
  icon?: string;
  status?: CategoryStatus;
  sub_categories?: SubCategory[];
  question_count?: number;
  attempted_count?: number;
}

export interface SubCategory {
  id: string;
  name: string;
  icon?: string;
  status?: CategoryStatus;
  subSubCategories: SubSubCategory[];
  question_count: number;
  attempted_count?: number;
}

export interface SubSubCategory {
  id: string;
  name: string;
  status?: CategoryStatus;
  question_count?: number;
}

export interface PaginationMeta {
  count: number;
  total_pages: number;
  current_page: number;
}

export interface GetCategoriesResponse {
  total_questions?: number;
  categories: Category[];
  pagination?: PaginationMeta;
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

export interface SubCategoryDetail {
  id: string;
  name: string;
  icon?: string;
  categoryId: string;
  categoryName: string;
  status?: CategoryStatus;
  question_count?: number;
}

export interface GetSubCategoriesResponse {
  subcategories: SubCategoryDetail[];
  pagination?: PaginationMeta;
}
