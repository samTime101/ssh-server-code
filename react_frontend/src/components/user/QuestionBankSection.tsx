import { Search } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
//import { getCategories } from "@/services/user/questionService.ts";
import { toast } from "sonner";
import { useQuestions } from "@/hooks/useQuestions.tsx";
import CategoryList from "./CategoryList";
import type { GetCategoriesResponse } from "@/types/category";
import { getCategories } from "@/services/user/question-service";
import { AuthContext } from "@/contexts/AuthContext";
import { getAttemptStats } from "@/utils/attemptUtils";

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
  const [reattemptWrongOnly, setReattemptWrongOnly] = useState(false);

  useEffect(() => {
    if (!token) return;
    const getCategoriesData = async () => {
      try {
        const categoryResponse = await getCategories();

        console.log("The category response:", categoryResponse);
        setCategories(categoryResponse);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories({ total_questions: 0, categories: [] });
        toast.error("Failed to fetch categories");
      }
    };
    getCategoriesData();
  }, [token]);

  const handleStartSession = async (reattemptWrongOnly: boolean) => {
    await fetchQuestions(reattemptWrongOnly);
    navigate("/userpanel/question");
  };

  const stats = getAttemptStats(user, categories);

  return (
    <section className="mx-auto flex min-h-full max-w-[1500px] flex-1 flex-col gap-8 p-8">
      {/* Header Section */}
      <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
        <h1 className="text-foreground mb-6 text-3xl font-bold">Question Bank</h1>
        <div className="space-y-3">
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{user?.completion_percent}% Complete</span>
          </div>
          <div className="bg-muted h-3 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${stats.progressPercent}%`,
                background: `linear-gradient(to right, #22c55e 0%, #22c55e ${stats.correctPercent}%, #ef4444 ${stats.correctPercent}%, #ef4444 100%)`,
              }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-green-600">{stats.totalRight} Correct</span>
            <span className="text-muted-foreground">
              {stats.totalAttempts} of {stats.totalQuestions} completed
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
        <div className="mb-8">
          <h2 className="text-foreground mb-4 text-2xl font-semibold">Start New Session</h2>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
            <Input
              placeholder="Search by Topic, Keyword, or Question ID"
              className="border-input focus:border-ring focus:ring-ring rounded-lg py-3 pr-4 pl-12 text-base"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={reattemptWrongOnly}
                onCheckedChange={() => setReattemptWrongOnly(!reattemptWrongOnly)}
              />
              <span className="text-muted-foreground">Reattempt Wrong Only</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-foreground mb-4 text-lg font-medium">Select Categories</h3>
          <ul className="space-y-3">
            {categories?.categories.map((category) => (
              <CategoryList key={category.id} category={category} />
            ))}
          </ul>
        </div>

        <div className="border-border mt-8 flex gap-4 border-t pt-6">
          <Button
            className="cursor-pointer rounded-lg px-8 py-6 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={() => handleStartSession(reattemptWrongOnly)}
          >
            Start Session
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuestionBankSection;
