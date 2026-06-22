import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { CreateCategoryResponse, GetCategoriesResponse, Category } from "@/types/category";

const toCategoryList = (raw: unknown): Category[] => {
  if (Array.isArray(raw)) return raw as Category[];
  if (raw && typeof raw === "object") {
    if ("results" in raw && Array.isArray(raw.results)) {
      return raw.results as Category[];
    }
    if ("categories" in raw && Array.isArray(raw.categories)) {
      return raw.categories as Category[];
    }
  }
  return [];
};

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

    let pagination = undefined;
    if (response.data && typeof response.data === "object" && "results" in response.data) {
      pagination = {
        count: response.data.count,
        total_pages: response.data.total_pages,
        current_page: response.data.current_page,
      };
    }

    return {
      categories: toCategoryList(response.data),
      pagination,
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
  icon?: string
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
      icon?: string;
    } = { name };
    if (status) {
      payload.status = status;
    }
    if (icon) {
      payload.icon = icon;
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
