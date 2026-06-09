import { Checkbox } from "@/components/ui/checkbox";
import { useQuestions } from "@/hooks/useQuestions";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/types/category";

const CategoryList: React.FC<{ category: Category }> = ({ category }) => {
  const {
    selectedCategoriesId,
    setSelectedCategoriesId,
    handleCategorySelection,
    selectedSubCategoryId,
    setSelectedSubCategoryId,
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

  const onCategoryCheckChange = (checked: boolean) => {
    if (checked) {
      if (!selectedCategoriesId.includes(category.id)) {
        setSelectedCategoriesId([...selectedCategoriesId, category.id]);
      }
      const subIds = category.sub_categories?.map(s => s.id) || [];
      setSelectedSubCategoryId(selectedSubCategoryId.filter((id: string) => !subIds.includes(id)));
      
      if (!expandedCategories.includes(category.id)) {
        toggleCategoryExpansion(category.id);
      }
    } else {
      setSelectedCategoriesId(selectedCategoriesId.filter((id: string) => id !== category.id));
      const subIds = category.sub_categories?.map(s => s.id) || [];
      setSelectedSubCategoryId(selectedSubCategoryId.filter((id: string) => !subIds.includes(id)));
    }
  };

  const onSubCategoryCheckChange = (subCategoryId: string, checked: boolean) => {
    const subIds = category.sub_categories?.map(s => s.id) || [];
    if (checked) {
      const newSubCatIds = [...selectedSubCategoryId, subCategoryId];
      setSelectedSubCategoryId(newSubCatIds);
      
      const allSelected = subIds.every(id => newSubCatIds.includes(id));
      if (allSelected && subIds.length > 0) {
        if (!selectedCategoriesId.includes(category.id)) {
          setSelectedCategoriesId([...selectedCategoriesId, category.id]);
        }
        setSelectedSubCategoryId(newSubCatIds.filter(id => !subIds.includes(id)));
      }
    } else {
      if (selectedCategoriesId.includes(category.id)) {
        setSelectedCategoriesId(selectedCategoriesId.filter((id: string) => id !== category.id));
        const otherSubIds = subIds.filter(id => id !== subCategoryId);
        const newSelectedSubs = new Set([...selectedSubCategoryId, ...otherSubIds]);
        setSelectedSubCategoryId(Array.from(newSelectedSubs));
      } else {
        setSelectedSubCategoryId(selectedSubCategoryId.filter((id: string) => id !== subCategoryId));
      }
    }
  };

  // Calculate category progress percentage
  const calculateProgress = (attempted: number = 0, total: number = 0): number => {
    if (total === 0) return 0;
    return Math.round((attempted / total) * 100);
  };

  const categoryProgress = calculateProgress(category.attempted_count, category.question_count);
  const isCategoryExpanded = expandedCategories.includes(category.id);
  
  const isCategoryChecked = selectedCategoriesId.includes(category.id) || (category.sub_categories && category.sub_categories.length > 0 && category.sub_categories.every(sub => selectedSubCategoryId.includes(sub.id)));

  return (
    <li
      key={category.id}
      className="border-border overflow-hidden rounded-lg border transition-all duration-200 hover:shadow-md"
    >
      <div className="bg-card p-4">
        {/* Category Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChevronRight
              className={`text-muted-foreground hover:text-foreground h-5 w-5 cursor-pointer transition-all duration-200 ${
                isCategoryExpanded ? "rotate-90" : ""
              }`}
              onClick={() => toggleCategoryExpansion(category.id)}
            />
            <Checkbox
            className="border-input appearance-none w-5 h-5 border-1 cursor-pointer"
              id={`category-${category.id}`}
              
              checked={isCategoryChecked}
              onCheckedChange={onCategoryCheckChange}
            />
            <label
              htmlFor={`category-${category.id}`}
              className="text-foreground cursor-pointer text-lg font-medium"
            >
              {category.name}
            </label>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${categoryProgress}%` }}
                ></div>
              </div>
              <div className="text-muted-foreground min-w-max text-sm">
                <span className="text-foreground font-medium">{category.attempted_count || 0}</span>
                <span className="text-muted-foreground mx-1">/</span>
                <span>{category.question_count || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-categories */}
        {isCategoryExpanded && (
          <div className="border-border mt-4 border-t pt-4">
            <ul className="space-y-2 pl-8">
              {category.sub_categories?.map((subCategory) => {
                // Calculate subcategory progress percentage
                // const subCategoryProgress = calculateProgress(
                //   subCategory.attempted_count,
                //   subCategory.question_count
                // );

                return (
                  <li
                    key={subCategory.id}
                    className="border-border overflow-hidden rounded-md border"
                  >
                    <div className="bg-muted p-3">
                      <div className="flex items-center justify-between">
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
                          className="border-input appearance-none w-5 h-5 border-1 cursor-pointer"
                            id={`subcategory-${subCategory.id}`}
                            
                            checked={
                              selectedCategoriesId.includes(category.id) ||
                              selectedSubCategoryId.includes(subCategory.id)
                            }
                            onCheckedChange={(checked) => onSubCategoryCheckChange(subCategory.id, !!checked)}
                          />
                          <label
                            htmlFor={`subcategory-${subCategory.id}`}
                            className="text-foreground cursor-pointer font-medium"
                          >
                            {subCategory.name}
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          {/* <div className="bg-background h-2 w-16 overflow-hidden rounded-full border border-border">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${subCategoryProgress}%` }}
                            ></div>
                          </div> */}
                          <div className="text-muted-foreground min-w-max text-sm">
                            <span className="text-foreground font-medium">
                              {subCategory.attempted_count || 0}
                            </span>
                            <span className="text-muted-foreground mx-1">/</span>
                            <span>{subCategory.question_count || 0}</span>
                          </div>
                        </div>
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
