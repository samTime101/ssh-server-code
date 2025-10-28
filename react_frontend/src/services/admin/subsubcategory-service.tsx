import { API_ENDPOINTS } from "@/config/apiConfig";
import type { AuthToken } from "@/types/auth";
import axiosInstance from "../axios";

export interface SubSubCategory {
  subSubCategoryId: number;
  subSubCategoryName: string;
  subCategoryId: string;
}

export async function createSubSubCategory(
  subCategoryId: string,
  subSubCategoryName: string,
  token: AuthToken
): Promise<{ message: string; subsubcategory: SubSubCategory }> {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.createSubSubCategory,
      {
        subCategoryID: subCategoryId,
        subSubCategoryName,
      },
      {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      }
    );

    if (!response) {
      throw new Error("Failed to create subsubcategory");
    }

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create subsubcategory");
  }
}
