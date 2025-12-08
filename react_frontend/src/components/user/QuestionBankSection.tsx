import { Search } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
//import { getCategories } from "@/services/user/questionService.ts";
import { toast } from "sonner";
import { useQuestions } from "@/hooks/useQuestions.tsx";
import CategoryList from "./CategoryList";
import type { GetCategoriesResponse } from "@/types/category";
import { getCategories } from "@/services/user/questionService";
import { AuthContext } from "@/contexts/AuthContext";



/*
    Please note that the implementation of sub-sub-categories is currently on hold
    as discussed with the team. The relevant code sections have been commented out
    for potential future use.
    
    Please do not delete them.
*/

const QuestionBankSection = () => {
  const { token } = useAuth();
  const { fetchQuestions } = useQuestions(); //selectedCategoriesId, selectedSubSubCategoryId, selectedSubCategoryId,
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState<GetCategoriesResponse>();


  useEffect(() => {
    if (!token) return;
    const getCategoriesData = async () => {
      try {
        const categoryResponse = await getCategories();
    
        console.log("The category response:", categoryResponse);
        setCategories(categoryResponse);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories({total_questions: 0, categories: [] });
        toast.error("Failed to fetch categories");
      }
    };
    getCategoriesData();
  }, [token]);

  const handleStartSession = async (reattemptWrongOnly: boolean) => {
    await fetchQuestions(reattemptWrongOnly);
    navigate("/userpanel/question");
  };

  return (
    <section className="mx-auto flex min-h-full max-w-[1500px] flex-1 flex-col gap-8 p-8">
      {/* Header Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Question Bank</h1>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Overall Progress</span>
            <span className="font-medium">{user?.completion_percent}% Complete</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: "65%" }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-green-600">{user?.total_right_attempts} Correct</span>
            <span className="text-gray-500">{user?.total_attempts} of {categories?.total_questions} completed</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Start New Session</h2>
          <div className="relative">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search by Topic, Keyword, or Question ID"
              className="rounded-lg border-gray-300 py-3 pr-4 pl-12 text-base focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Select Categories</h3>
          <ul className="space-y-3">
            {categories?.categories.map((category) => (
              <CategoryList key={category.id} category={category} />
            ))}
          </ul>
        </div>

        <div className="mt-8 flex gap-4 border-t border-gray-200 pt-6">
          <Button
            className="cursor-pointer rounded-lg px-8 py-6 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={() => handleStartSession(false)}
          >
            Start Session
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer rounded-lg px-8 py-6 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={() => handleStartSession(true)}
          >
            Reattempt Wrong Only
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuestionBankSection;
