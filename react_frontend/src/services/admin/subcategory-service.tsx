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

export async function fetchSubcategories(): Promise<SubCategoryDetail[]> {
  try {
    const [subcategoriesResponse, categoriesResponse] = await Promise.all([
      axiosInstance.get(API_ENDPOINTS.getSubcategories),
      axiosInstance.get(API_ENDPOINTS.getCategories),
    ]);

    const categoryList: Category[] = Array.isArray(categoriesResponse.data)
      ? categoriesResponse.data
      : (categoriesResponse.data?.categories ?? []);
    const categoryNameById = new Map(categoryList.map((cat) => [cat.id, cat.name]));

    const rawSubcategories: RawSubcategory[] = Array.isArray(subcategoriesResponse.data)
      ? subcategoriesResponse.data
      : (subcategoriesResponse.data?.results ?? subcategoriesResponse.data?.subcategories ?? []);

    return rawSubcategories.map((sub) => {
      const categoryId =
        typeof sub.category === "string" ? sub.category : sub.category?.id || sub.category_id || "";

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
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch subcategories");
  }
}

export async function updateSubCategory(
  id: string,
  name: string,
  categoryId: string
): Promise<any> {
  try {
    const response = await axiosInstance.put(`${API_ENDPOINTS.createSubCategory}${id}/`, {
      name,
      category: categoryId,
    });
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
