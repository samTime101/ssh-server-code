import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "../axios";

export interface SubSubCategory {
  subSubCategoryId: number;
  subSubCategoryName: string;
  subCategoryId: string;
}

export async function createSubSubCategory(
  subCategoryId: string,
  subSubCategoryName: string
): Promise<{ message: string; subsubcategory: SubSubCategory }> {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.createSubSubCategory, {
      subCategoryID: subCategoryId,
      subSubCategoryName,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create subsubcategory");
  }
}
