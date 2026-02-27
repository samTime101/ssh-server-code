import type { Category, SubCategory } from "@/types/category";

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
