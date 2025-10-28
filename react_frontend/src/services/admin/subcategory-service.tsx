//TODO: FIX THE TYPES OF FUNCTION **createSubCategory**

import { API_ENDPOINTS } from "@/config/apiConfig";
import { API_URL } from "@/lib/utils";
import type { AuthToken } from "@/types/auth";
import type { Category, CreateSubCategoryResponse } from "@/types/category";
import axios from "axios";
// Force re-evaluation of this module

export async function createSubCategory(
  categoryId: string,
  subCategoryName: string,
  token: AuthToken
): Promise<{ message: string; subcategory: CreateSubCategoryResponse }> {
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
  token: string
): Promise<{ total_question_count: number; categories: Category[] }> {
  // const response = await fetch(`${API_URL}/api/get/categories/`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token.access}`,
  //   },
  // });

  const response = await axios.get(`${API_ENDPOINTS.getCategories}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response) {
    throw new Error("Failed to fetch categories");
  }

  const transformedData = {
    ...response.data,
    categories: response.data.categories.map((category: any) => ({
      categoryId: category.id,
      categoryName: category.name,
      question_count: category.question_count,
      subCategories: category.subCategories.map((subcategory: any) => ({
        subCategoryId: subcategory.id,
        subCategoryName: subcategory.name,
        subSubCategory: subcategory.subSubCategories,
        question_count: subcategory.question_count,
      })),
    })),
  };
  console.log(transformedData);
  return transformedData;
}
