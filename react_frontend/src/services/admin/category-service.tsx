import type { AuthToken } from "@/types/auth";
import axiosInstance from "../axios";

const API_URL = "http://localhost:8000";

export interface Category {
  id: string;
  name: string;
}

// export interface SubCategory {
//   subCategoryId: string;
//   subCategoryName: string;
//   categoryId: string;
//   categoryName: string;
//   subParentId : string;
// }

export interface CreateCategoryResponse {
  message: string;
  category: Category;
}

export const createCategory = async (
  //TODO: Confirm the type of categoryName
  categoryName: Category,
  token: AuthToken
): Promise<CreateCategoryResponse> => {
  const response = await axiosInstance.post(`${API_URL}/api/create/category/`, categoryName, {
    headers: {
      Authorization: `Bearer ${token.access}`,
    },
  });

  if (!response.data) {
    throw new Error("Failed to create category");
  }

  return response.data;
};
