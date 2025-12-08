//TODO: FIX THE TYPES OF FUNCTION **createSubCategory**

import { API_ENDPOINTS } from "@/config/apiConfig";
import type { Category, CreateSubCategoryResponse } from "@/types/category";
import axiosInstance from "../axios";

// Force re-evaluation of this module

export async function createSubCategory(
  categoryId: string,
  subCategoryName: string
): Promise<{ message: string; subcategory: CreateSubCategoryResponse }> {
  const categoryData = { category: categoryId, name: subCategoryName };
  console.log("The category data being sent is ", categoryData);
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.createSubCategory, categoryData);

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create subcategory");
  }
}

export async function getCategories(): Promise<{
  total_question_count: number;
  categories: Category[];
}> {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.getCategories}`);

    console.log("Raw response data:", response.data);

    const transformedData = {
      ...response.data,
      categories: response.data.map((category: any) => ({
        categoryId: category.id,
        categoryName: category.name,
      })),
    };
    console.log("The transformed data is ", transformedData);
    return transformedData;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch categories");
  }
}
