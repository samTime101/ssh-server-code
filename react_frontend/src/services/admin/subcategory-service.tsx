import { API_ENDPOINTS } from "@/config/apiConfig";
import type { CreateSubCategoryResponse, GetSubCategoriesResponse } from "@/types/category";
import { extractPagination, toCategoryList } from "@/utils/categoryUtils";
import axiosInstance from "../axios";

type RawSubcategory = {
  id: string;
  name: string;
  icon?: string;
  status?: "approved" | "pending" | "rejected";
  question_count?: number;
  category?: string | { id?: string; name?: string };
  category_id?: string;
  category_name?: string;
};

export async function createSubCategory(
  categoryId: string,
  subCategoryName: string,
  icon?: string
): Promise<CreateSubCategoryResponse> {
  const categoryData: { category: string; name: string; icon?: string } = {
    category: categoryId,
    name: subCategoryName,
  };
  if (icon) {
    categoryData.icon = icon;
  }
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.createSubCategory, categoryData);

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create subcategory");
  }
}

const toSubcategoryResultList = (raw: unknown): RawSubcategory[] => {
  if (Array.isArray(raw)) return raw as RawSubcategory[];
  if (raw && typeof raw === "object") {
    const data = raw as Record<string, unknown>;
    if (Array.isArray(data.results)) return data.results as RawSubcategory[];
    if (Array.isArray(data.subcategories)) return data.subcategories as RawSubcategory[];
  }
  return [];
};

export async function fetchSubcategories(
  page: number = 1,
  pageSize: number = 10
): Promise<GetSubCategoriesResponse> {
  try {
    const [subcategoriesResponse, categoriesResponse] = await Promise.all([
      axiosInstance.get(`${API_ENDPOINTS.getSubcategories}?page=${page}&page_size=${pageSize}`),
      axiosInstance.get(`${API_ENDPOINTS.getCategories}?page_size=1000`),
    ]);

    const categoryList = toCategoryList(categoriesResponse.data);
    const categoryNameById = new Map(categoryList.map((cat) => [cat.id, cat.name]));
    const categoryIdByName = new Map(
      categoryList.map((cat) => [cat.name.trim().toLowerCase(), cat.id])
    );

    const rawSubcategories = toSubcategoryResultList(subcategoriesResponse.data);

    const subcategories = rawSubcategories.map((sub) => {
      const normalizedCategoryName =
        sub.category_name?.trim().toLowerCase() ||
        (typeof sub.category === "object" ? sub.category?.name?.trim().toLowerCase() : undefined);

      const categoryId =
        (typeof sub.category === "string" ? sub.category : sub.category?.id) ||
        sub.category_id ||
        (normalizedCategoryName ? categoryIdByName.get(normalizedCategoryName) : undefined) ||
        "";

      const categoryName =
        sub.category_name ||
        (typeof sub.category === "object" ? sub.category?.name : undefined) ||
        categoryNameById.get(categoryId) ||
        "-";

      return {
        id: sub.id,
        name: sub.name,
        icon: sub.icon,
        status: sub.status,
        categoryId,
        categoryName,
        question_count: sub.question_count,
      };
    });

    return {
      subcategories,
      pagination: extractPagination(subcategoriesResponse.data),
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch subcategories");
  }
}

export async function updateSubCategory(
  id: string,
  name: string,
  categoryId: string,
  status?: "approved" | "pending" | "rejected",
  icon?: string | null
): Promise<any> {
  try {
    const payload: {
      name: string;
      category: string;
      status?: "approved" | "pending" | "rejected";
      icon?: string | null;
    } = {
      name,
      category: categoryId,
    };
    if (status) {
      payload.status = status;
    }
    if (icon !== undefined) {
      payload.icon = icon || null;
    }
    const response = await axiosInstance.put(`${API_ENDPOINTS.createSubCategory}${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update subcategory");
  }
}

export async function deleteSubCategory(id: string): Promise<void> {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.createSubCategory}${id}/`);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete subcategory");
  }
}
