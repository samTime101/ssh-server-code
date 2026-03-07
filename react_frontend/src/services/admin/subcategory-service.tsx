import { API_ENDPOINTS } from "@/config/apiConfig";
import type { Category, CreateSubCategoryResponse, SubCategoryDetail } from "@/types/category";
import axiosInstance from "../axios";

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
    const response = await axiosInstance.get(API_ENDPOINTS.getCategoriesWithHierarchy);
    const categories: Category[] = response.data?.categories ?? [];
    const flat: SubCategoryDetail[] = [];
    for (const cat of categories) {
      for (const sub of cat.sub_categories ?? []) {
        flat.push({
          id: sub.id,
          name: sub.name,
          categoryId: cat.id,
          categoryName: cat.name,
          question_count: sub.question_count,
        });
      }
    }
    return flat;
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
