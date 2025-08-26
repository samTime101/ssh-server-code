import { API_URL } from "@/lib/utils";
import type { AuthToken } from "@/types/auth";

// Force re-evaluation of this module

export interface Category {
  categoryId: string;
  categoryName: string;
}

export interface SubCategory {
  subCategoryId: string;
  subCategoryName: string;
  categoryId: string;
  categoryName: string;
}

export async function createSubCategory(
  categoryId: string,
  subCategoryName: string,
  token: AuthToken
): Promise<{ message: string; subcategory: SubCategory }> {
  const response = await fetch(`${API_URL}/api/create/subcategory/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access}`,
    },
    body: JSON.stringify({ categoryID: categoryId, subCategoryName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create subcategory");
  }

  return response.json();
}

export async function getCategories(
  token: AuthToken
): Promise<{ message: string; categories: Category[] }> {
  const response = await fetch(`${API_URL}/api/get/categories/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch categories");
  }

  const data = await response.json();
  const transformedData = {
    ...data,
    categories: data.categories.map((category: any) => ({
      categoryId: category.id,
      categoryName: category.name,
    })),
  };
  return transformedData;
}
