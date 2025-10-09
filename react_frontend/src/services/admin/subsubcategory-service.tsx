import { API_URL } from "@/lib/utils";
import type { AuthToken } from "@/types/auth";

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
  const response = await fetch(`${API_URL}/api/create/subsubcategory/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access}`,
    },
    body: JSON.stringify({ subCategoryID: subCategoryId, subSubCategoryName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create subsubcategory");
  }

  return response.json();
}
