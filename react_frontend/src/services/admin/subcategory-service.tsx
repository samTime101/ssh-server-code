//TODO: FIX THE TYPES OF FUNCTION **createSubCategory**

import { API_ENDPOINTS } from "@/config/apiConfig";
import type { AuthToken } from "@/types/auth";
import type { Category, CreateSubCategoryResponse } from "@/types/category";
import axios from "axios";
import axiosInstance from "../axios";

// Force re-evaluation of this module

export async function createSubCategory(
  categoryId: string,
  subCategoryName: string,
  token: AuthToken
): Promise<{ message: string; subcategory: CreateSubCategoryResponse }> {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.createSubCategory,
      {
        categoryID: categoryId,
        subCategoryName,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access}`,
        },
      }
    );
    if (!response) {
      throw new Error("Failed to create subcategory");
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create subcategory");
  }
}

export async function getCategories(
  token: string
): Promise<{ total_question_count: number; categories: Category[] }> {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.getCategories}`, {
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
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch categories");
  }
}
