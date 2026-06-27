import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { CreateCategoryResponse, GetCategoriesResponse, Category } from "@/types/category";
import { extractPagination, toCategoryList } from "@/utils/categoryUtils";

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

export const fetchCategories = async (
  page: number = 1,
  pageSize: number = 10
): Promise<GetCategoriesResponse> => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.getCategories}?page=${page}&page_size=${pageSize}`
    );

    return {
      categories: toCategoryList(response.data),
      pagination: extractPagination(response.data),
    };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
};

export const fetchCategoriesWithHierarchy = async (): Promise<GetCategoriesResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.getCategoriesWithHierarchy);
    return {
      categories: toCategoryList(response.data),
    };
  } catch (error) {
    console.error("Failed to fetch categories hierarchy:", error);
    throw new Error("Failed to fetch categories");
  }
};

export const updateCategory = async (
  id: string,
  name: string,
  status?: "approved" | "pending" | "rejected",
  icon?: string | null
): Promise<{
  id: string;
  name: string;
  status?: "approved" | "pending" | "rejected";
  icon?: string;
}> => {
  try {
    const payload: {
      name: string;
      status?: "approved" | "pending" | "rejected";
      icon?: string | null;
    } = { name };
    if (status) {
      payload.status = status;
    }
    if (icon !== undefined) {
      payload.icon = icon || null;
    }
    const response = await axiosInstance.put(`${API_ENDPOINTS.createCategory}${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update category");
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.createCategory}${id}/`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete category");
  }
};
