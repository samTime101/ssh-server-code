import type { AuthToken } from "@/types/auth";

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
  categoryName: Category,
  token: AuthToken
): Promise<CreateCategoryResponse> => {
  const response = await fetch(`${API_URL}/api/create/category/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access}`,
    },
    body: JSON.stringify({ categoryName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create category");
  }

  return response.json();
};