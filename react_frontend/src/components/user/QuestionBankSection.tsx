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
import type { Category, GetCategoriesResponse } from "@/types/category";
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
  const { fetchQuestions, sessionTimerSeconds, configureSessionTimer, startSessionTimer } =
    useQuestions(); //selectedCategoriesId, selectedSubSubCategoryId, selectedSubCategoryId,
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState<GetCategoriesResponse>();
  const [reattemptWrongOnly, setReattemptWrongOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const timerMinutes = Math.floor(sessionTimerSeconds / 60);
  const timerSeconds = sessionTimerSeconds % 60;

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
    startSessionTimer(sessionTimerSeconds);
    await fetchQuestions(reattemptWrongOnly);
    navigate("/userpanel/question");
  };

  const handleTimerMinutesChange = (value: string) => {
    const parsedMinutes = Number.parseInt(value, 10);
    configureSessionTimer(Number.isNaN(parsedMinutes) ? 0 : parsedMinutes, timerSeconds);
  };

  const handleTimerSecondsChange = (value: string) => {
    const parsedSeconds = Number.parseInt(value, 10);
    configureSessionTimer(timerMinutes, Number.isNaN(parsedSeconds) ? 0 : parsedSeconds);
  };

  const normalizeSearch = searchQuery.trim().toLowerCase();
  const filteredCategories: Category[] = !normalizeSearch
    ? (categories?.categories ?? [])
    : (categories?.categories ?? [])
        .map((category) => {
          const categoryMatches =
            category.name.toLowerCase().includes(normalizeSearch) ||
            category.id.toLowerCase().includes(normalizeSearch);

          const matchingSubCategories = (category.sub_categories ?? []).filter(
            (subCategory) =>
              subCategory.name.toLowerCase().includes(normalizeSearch) ||
              subCategory.id.toLowerCase().includes(normalizeSearch)
          );

          if (categoryMatches) return category;
          if (matchingSubCategories.length === 0) return null;

          return {
            ...category,
            sub_categories: matchingSubCategories,
          };
        })
        .filter((category): category is Category => category !== null);

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {filteredCategories.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No matching topics found for your search.
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredCategories.map((category) => (
                <CategoryList key={category.id} category={category} />
              ))}
            </ul>
          )}
        </div>

        <div className="border-border mt-8 flex flex-wrap items-center gap-3 border-t pt-6">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">Timer</span>
            <Input
              type="number"
              min={0}
              className="h-8 w-16 px-2 text-center"
              value={timerMinutes}
              onChange={(e) => handleTimerMinutesChange(e.target.value)}
              aria-label="Timer minutes"
            />
            <span className="text-muted-foreground text-xs">m</span>
            <Input
              type="number"
              min={0}
              max={59}
              className="h-8 w-16 px-2 text-center"
              value={timerSeconds}
              onChange={(e) => handleTimerSecondsChange(e.target.value)}
              aria-label="Timer seconds"
            />
            <span className="text-muted-foreground text-xs">s</span>
          </div>

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
