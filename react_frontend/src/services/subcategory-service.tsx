// FILE MODIFIED ON SEP 3 BY SAMIP REGMI  
//TODO: FIX THE TYPES OF FUNCTION **createSubCategory** 


import { API_URL } from "@/lib/utils";
import type { AuthToken } from "@/types/auth";

// Force re-evaluation of this module

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
): Promise<{ total_question_count: number; categories: Category[] }> {
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
      // -----ADDED BY SAMIP REGMI----
      question_count: category.question_count,
      // --------------------------------
      subCategories: category.subCategories.map((subcategory: any) => ({
        subCategoryId: subcategory.id, 
        subCategoryName: subcategory.name, 
        subSubCategory: subcategory.subSubCategories,
        // -----------ADDED BY SAMIP REGMI----
        question_count: subcategory.question_count,
        // ------------------------------------
      }))
    })),
  };
console.log(transformedData);
  return transformedData;
}
