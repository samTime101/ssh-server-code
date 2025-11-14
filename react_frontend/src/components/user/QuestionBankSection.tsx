import { Search, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
//import { getCategories } from "@/services/user/questionService.ts";
import { toast } from "sonner";
import { useQuestions } from "@/hooks/useQuestions.tsx";
import { fetchCategories } from "@/services/admin/category-service";
import type { Category, GetCategoriesResponse } from "@/types/category";

const QuestionBankSection = () => {
  const { token } = useAuth();
  const {  fetchQuestions } =  //selectedCategoriesId, selectedSubSubCategoryId, selectedSubCategoryId,
    useQuestions();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<GetCategoriesResponse>();

  useEffect(() => {
    if (!token) return;
    const getCategoriesData = async () => {
      try {
        const categoryResponse = await fetchCategories(token);
        console.log("The category response:", categoryResponse);
        setCategories(categoryResponse);
      } catch (error) {
        setCategories({ total_question_count: 0, categories: [] });
        toast.error("Failed to fetch categories");
      }
    };
    getCategoriesData();
  }, [token]);

  return (
    <section className="flex-1 p-8 min-h-full flex flex-col gap-8 max-w-[1500px] mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Question Bank</h1>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Overall Progress</span>
            <span className="font-medium">65% Complete</span>
          </div>
          <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: "65%" }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-600 font-medium">160 Correct</span>
            <span className="text-gray-500">160 of 260 completed</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Start New Session</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by Topic, Keyword, or Question ID"
              className="pl-12 pr-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Categories</h3>
          <ul className="space-y-3">
            {categories?.categories.map((category) => (
              <CategoryList key={category.id} category={category} />
            ))}
          </ul>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            className="font-medium px-8 py-6 cursor-pointer rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={async () => {
              await fetchQuestions();
              navigate("/userpanel/question");
            }}
          >
            Start Session
          </Button>
        </div>
      </div>
    </section>
  );
};

const CategoryList: React.FC<{ category: Category }> = ({ category }) => {
  console.log("Category data:", category);
  const {
    selectedCategoriesId,
    handleCategorySelection,
    handleSubCategorySelection,
  } = useQuestions();

  const [expandedCategories, setExpandedCategories] = useState<(string | number)[]>([]);

  const toggleCategoryExpansion = (categoryId: string | number) => {
    console.log("Toggling category:", categoryId);
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  //   const progressData = getProgressData(category.id);
  //   const completedPercentage = (progressData.completed / progressData.total) * 100;
  const isCategoryExpanded = expandedCategories.includes(category.id);

  return (
    <li
      key={category.id}
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
    >
      <div className="bg-white p-4">
        {/* Category Level */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChevronRight
              className={`text-gray-400 hover:text-gray-600 transition-all duration-200 w-5 h-5 cursor-pointer ${
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
              className="text-gray-900 font-medium cursor-pointer text-lg"
            >
              {category.name}
            </label>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 h-2 w-24 rounded-full overflow-hidden">
                {/* <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completedPercentage}%` }}
                ></div> */}
              </div>
              <div className="text-sm text-gray-600 min-w-max">
                {/* <span className="font-medium text-gray-900">{progressData.completed}</span> */}
                <span className="text-gray-400 mx-1">/</span>
                {/* <span>{progressData.total}</span> */}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-500">
              {/* {Math.round(completedPercentage)}% */}
            </div>
          </div>
        </div>

        {/* Sub-categories */}
        {isCategoryExpanded && category.sub_categories && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <ul className="space-y-2 pl-8">
              {category.sub_categories.map((subCategory) => {
                return (
                  <li
                    key={subCategory.id}
                    className="border border-gray-100 rounded-md overflow-hidden"
                  >
                    <div className="p-3 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`subcategory-${subCategory.id}`}
                          className="border-gray-300"
                          onCheckedChange={() => handleSubCategorySelection(subCategory.id)}
                        />
                        <label
                          htmlFor={`subcategory-${subCategory.id}`}
                          className="cursor-pointer text-gray-800 font-medium"
                        >
                          {subCategory.name}
                        </label>
                      </div>
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
export default QuestionBankSection;
