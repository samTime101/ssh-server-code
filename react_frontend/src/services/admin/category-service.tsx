import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { CreateCategoryResponse, GetCategoriesResponse, Category } from "@/types/category";

export const createCategory = async (
  //TODO: Confirm the type of categoryName
  categoryName: Category
): Promise<CreateCategoryResponse> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.createCategory, categoryName);

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create category");
  }
};

export const fetchCategories = async (): Promise<GetCategoriesResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.getCategoriesWithHierarchy);

    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
};
