import { API_ENDPOINTS } from "@/config/apiConfig";
import type { Category, CreateSubCategoryResponse, SubCategoryDetail } from "@/types/category";
import axiosInstance from "../axios";

type RawSubcategory = {
  id: string;
  name: string;
  status?: "approved" | "pending" | "rejected";
  question_count?: number;
  category?: string | { id?: string; name?: string };
  category_id?: string;
  category_name?: string;
};

export async function createSubCategory(
  categoryId: string,
  subCategoryName: string
): Promise<CreateSubCategoryResponse> {
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

export async function fetchSubcategories(page: number = 1, pageSize: number = 10): Promise<import("@/types/category").GetSubCategoriesResponse> {
  try {
    const [subcategoriesResponse, categoriesResponse] = await Promise.all([
      axiosInstance.get(`${API_ENDPOINTS.getSubcategories}?page=${page}&page_size=${pageSize}`),
      axiosInstance.get(`${API_ENDPOINTS.getCategories}?page_size=1000`) // Try to get all categories for mapping
    ]);

    const categoryList: Category[] = Array.isArray(categoriesResponse.data)
      ? categoriesResponse.data
      : (categoriesResponse.data?.categories ?? categoriesResponse.data?.results ?? []);
    const categoryNameById = new Map(categoryList.map((cat) => [cat.id, cat.name]));
    const categoryIdByName = new Map(
      categoryList.map((cat) => [cat.name.trim().toLowerCase(), cat.id])
    );

    const rawSubcategories: RawSubcategory[] = Array.isArray(subcategoriesResponse.data)
      ? subcategoriesResponse.data
      : (subcategoriesResponse.data?.results ?? subcategoriesResponse.data?.subcategories ?? []);

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
        status: sub.status,
        categoryId,
        categoryName,
        question_count: sub.question_count,
      };
    });

    let pagination = undefined;
    if (subcategoriesResponse.data && typeof subcategoriesResponse.data === "object" && "results" in subcategoriesResponse.data) {
      pagination = {
        count: subcategoriesResponse.data.count,
        total_pages: subcategoriesResponse.data.total_pages,
        current_page: subcategoriesResponse.data.current_page,
      };
    }

    return {
      subcategories,
      pagination,
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
  status?: "approved" | "pending" | "rejected"
): Promise<any> {
  try {
    const payload: {
      name: string;
      category: string;
      status?: "approved" | "pending" | "rejected";
    } = {
      name,
      category: categoryId,
    };
    if (status) {
      payload.status = status;
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
