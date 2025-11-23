import { Checkbox } from "@/components/ui/checkbox";
import { useQuestions } from "@/hooks/useQuestions";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/types/category";

const CategoryList: React.FC<{ category: Category }> = ({ category }) => {
  const {
    selectedCategoriesId,
    handleCategorySelection,
    // selectedSubCategoryId,
    handleSubCategorySelection,
    // selectedSubSubCategoryId,
    // handleSubSubCategorySelection,
  } = useQuestions();

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  // const [expandedSubCategories, setExpandedSubCategories] = useState<number[]>([]);

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  // Subsub category is disabled for now, it will be implemented in future
  // const toggleSubCategoryExpansion = (subCategoryId: number) => {
  //   setExpandedSubCategories((prev) =>
  //     prev.includes(subCategoryId)
  //       ? prev.filter((id) => id !== subCategoryId)
  //       : [...prev, subCategoryId]
  //   );
  // };

  //   const progressData = getProgressData(category.id);
  //   const completedPercentage = (progressData.completed / progressData.total) * 100;
  const isCategoryExpanded = expandedCategories.includes(category.id);

  return (
    <li
      key={category.id}
      className="overflow-hidden rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md"
    >
      <div className="bg-white p-4">
        {/* Category Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChevronRight
              className={`h-5 w-5 cursor-pointer text-gray-400 transition-all duration-200 hover:text-gray-600 ${
                isCategoryExpanded ? "rotate-90" : ""
              }`}
              onClick={() => toggleCategoryExpansion(category.id)}
            />
            <Checkbox
              id={`category-${category.id}`}
              className="border-gray-300"
              checked={selectedCategoriesId.includes(category.id)}
              onCheckedChange={() => handleCategorySelection(category.id)}
            />
            <label
              htmlFor={`category-${category.id}`}
              className="cursor-pointer text-lg font-medium text-gray-900"
            >
              {category.name}
            </label>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                {/* <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completedPercentage}%` }}
                ></div> */}
              </div>
              <div className="min-w-max text-sm text-gray-600">
                { <span className="font-medium text-gray-900">{category.attempted_count}</span> }
                <span className="mx-1 text-gray-400">/</span>
                { <span>{category.question_count}</span> }
              </div>
            </div>
            <div className="text-sm font-medium text-gray-500">
              {/* {Math.round(completedPercentage)}% */}
            </div>
          </div>
        </div>

        {/* Sub-categories */}
        {isCategoryExpanded && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <ul className="space-y-2 pl-8">
              {category.sub_categories?.map((subCategory) => {
                // const isSubCategoryExpanded = expandedSubCategories.includes(subCategory.id);

                return (
                  <li
                    key={subCategory.id}
                    className="overflow-hidden rounded-md border border-gray-100"
                  >
                    <div className="bg-gray-50 p-3">
                      <div className="flex items-center gap-2">
                        {/* {subCategory.subSubCategories.length > 0 && (
                          <ChevronRight
                            className={`text-gray-400 hover:text-gray-600 transition-all duration-200 w-4 h-4 cursor-pointer ${
                              isSubCategoryExpanded ? "rotate-90" : ""
                            }`}
                            onClick={() => toggleSubCategoryExpansion(subCategory.id)}
                          />
                        )} */}
                        <Checkbox
                          id={`subcategory-${subCategory.id}`}
                          className="border-gray-300"
                          onCheckedChange={() => handleSubCategorySelection(subCategory.id)}
                        />
                        <label
                          htmlFor={`subcategory-${subCategory.id}`}
                          className="cursor-pointer font-medium text-gray-800"
                        >
                          {subCategory.name}
                        </label>
                      </div>

                      {/* Sub-sub-categories */}
                      {/* {isSubCategoryExpanded && subCategory.subSubCategories.length > 0 && (
                        <ul className="mt-3 space-y-2 pl-6">
                          {subCategory.subSubCategories.map((subSubCategory) => (
                            <li
                              key={subSubCategory.id}
                              className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors duration-150 hover:bg-gray-100"
                            >
                              <Checkbox
                                id={`subsubcategory-${subSubCategory.id}`}
                                className="border-gray-300"
                                onCheckedChange={() =>
                                  handleSubSubCategorySelection(subSubCategory.id)
                                }
                              />
                              <label
                                htmlFor={`subsubcategory-${subSubCategory.id}`}
                                className="cursor-pointer text-sm text-gray-700"
                              >
                                {subSubCategory.name}
                              </label>
                            </li>
                          ))}
                        </ul>
                      )} */}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </li>
  );
};

export default CategoryList;
