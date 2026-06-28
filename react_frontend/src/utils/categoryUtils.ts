import type { Category, PaginationMeta, SubCategory } from "@/types/category";

/** API may return a bare array or `{ results }` / `{ categories }`. */
export const toCategoryList = (raw: unknown): Category[] => {
  if (Array.isArray(raw)) return raw as Category[];
  if (raw && typeof raw === "object") {
    const data = raw as Record<string, unknown>;
    if (Array.isArray(data.results)) return data.results as Category[];
    if (Array.isArray(data.categories)) return data.categories as Category[];
  }
  return [];
};

export const extractPagination = (raw: unknown): PaginationMeta | undefined => {
  if (raw && typeof raw === "object" && "results" in raw) {
    const data = raw as Record<string, unknown>;
    return {
      count: data.count as number,
      total_pages: data.total_pages as number,
      current_page: data.current_page as number,
    };
  }
  return undefined;
};

export const collectSubcategoriesFromCategories = (
  categoryIds: string[],
  categories: Category[]
): SubCategory[] => {
  const allSubCategories: SubCategory[] = [];
  const seen = new Set<string>();

  categoryIds.forEach((catId) => {
    const selectedCategory = categories.find((cat) => cat.id == catId);
    if (selectedCategory?.sub_categories) {
      selectedCategory.sub_categories.forEach((subCat) => {
        if (!seen.has(subCat.id.toString())) {
          allSubCategories.push(subCat);
          seen.add(subCat.id.toString());
        }
      });
    }
  });

  return allSubCategories;
};
