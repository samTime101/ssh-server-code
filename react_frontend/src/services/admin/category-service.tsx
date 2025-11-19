import type { AuthToken } from "@/types/auth";
import axiosInstance from "../axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type {
  CreateCategoryResponse,
  GetCategoriesResponse,
  Category,
} from "@/types/category";

export const createCategory = async (
  //TODO: Confirm the type of categoryName
  categoryName: Category,
  token: AuthToken
): Promise<CreateCategoryResponse> => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.createCategory,
    categoryName,
    {
      headers: {
        Authorization: `Bearer ${token.access}`,
      },
    }
  );

  if (!response.data) {
    throw new Error("Failed to create category");
  }

  return response.data;
};

export const fetchCategories = async (
  token: string
): Promise<GetCategoriesResponse> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.getCategoriesWithHierarchy, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data || [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
};
