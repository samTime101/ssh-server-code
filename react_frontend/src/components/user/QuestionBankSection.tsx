import { Minus, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuestions } from "@/hooks/useQuestions.tsx";
import CategoryList from "./CategoryList";
import type { Category, GetCategoriesResponse } from "@/types/category";
import { getCategories } from "@/services/user/question-service";
import { getQuestionBankAnalytics } from "@/services/user/analytics-service";
import type { QuestionBankAnalytics } from "@/types/analytics";
import { getQuestionBankProgress } from "@/utils/questionBankUtils";
import {
  EXAM_MINUTES_STEP,
  EXAM_QUESTION_STEP,
  MAX_EXAM_MINUTES,
  MAX_EXAM_QUESTIONS,
  MIN_EXAM_MINUTES,
  MIN_EXAM_QUESTIONS,
} from "@/utils/examModeUtils";
import { resolveUnfinishedStart } from "@/utils/sessionResume";
import { markSubmissionNonContinuable } from "@/utils/sessionTimerStorage";
import { useContinueSessionPrompt } from "@/components/user/ContinueSessionModal";
import { Skeleton } from "@/components/ui/skeleton";

/*
    Please note that the implementation of sub-sub-categories is currently on hold
    as discussed with the team. The relevant code sections have been commented out
    for potential future use.
    
    Please do not delete them.
*/

const QuestionBankSection = () => {
  const { token } = useAuth();
  const {
    fetchQuestions,
    sessionTimerSeconds,
    sessionQuestionLimit,
    isExamModeEnabled,
    setIsExamModeEnabled,
    configureSessionTimer,
    configureSessionQuestionLimit,
    startSessionTimer,
    clearSessionTimer,
    setSessionQuestions,
    selectedCategoriesId,
    selectedSubCategoryId,
  } = useQuestions();
  const navigate = useNavigate();
  const { ask: askContinueOrNew, modal: continueModal } = useContinueSessionPrompt(
    "You have an unfinished question bank session. Continue where you left off, or start a new one?"
  );

  const [categories, setCategories] = useState<GetCategoriesResponse>();
  const [reattemptWrongOnly, setReattemptWrongOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const timerMinutes = Math.floor(sessionTimerSeconds / 60);

  useEffect(() => {
    if (!token) return;
    const getCategoriesData = async () => {
      try {
        setCategories(await getCategories());
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories({ total_questions: 0, categories: [] });
        toast.error("Failed to fetch categories");
      }
    };
    getCategoriesData();
  }, [token]);

  const handleStartSession = async (wrongOnly: boolean) => {
    if (isExamModeEnabled) {
      clearSessionTimer();
      const submissionId = await fetchQuestions(wrongOnly);
      if (!submissionId) {
        toast.error("Failed to start exam session.");
        return;
      }
      markSubmissionNonContinuable(submissionId);
      startSessionTimer(sessionTimerSeconds);
      navigate("/userpanel/question");
      return;
    }

    clearSessionTimer();

    try {
      const result = await resolveUnfinishedStart({
        kind: "question_bank",
        askContinue: askContinueOrNew,
        setSessionQuestions,
      });
      if (result === "cancel") return;
      if (result === "resumed") {
        navigate("/userpanel/question");
        return;
      }
    } catch (error) {
      console.error("Failed to check previous question bank session:", error);
    }

    await fetchQuestions(wrongOnly);
    navigate("/userpanel/question");
  };

  const adjustQuestionCount = (direction: "inc" | "dec") => {
    const delta = direction === "inc" ? EXAM_QUESTION_STEP : -EXAM_QUESTION_STEP;
    configureSessionQuestionLimit(sessionQuestionLimit + delta);
  };

  const adjustDurationMinutes = (direction: "inc" | "dec") => {
    const delta = direction === "inc" ? EXAM_MINUTES_STEP : -EXAM_MINUTES_STEP;
    configureSessionTimer(timerMinutes + delta, 0);
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

  const [analytics, setAnalytics] = useState<QuestionBankAnalytics | null>(null);

  useEffect(() => {
    if (!token) return;
    const loadAnalytics = async () => {
      try {
        const data = await getQuestionBankAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load question bank analytics:", err);
        setAnalytics(null);
      }
    };

    void loadAnalytics();
  }, [token]);

  const stats = getQuestionBankProgress(analytics);
  return (
    <section className="mx-auto flex min-h-full max-w-[1500px] flex-1 flex-col gap-8 px-5 pt-0 pb-8 md:p-8">
      {/* Header Section */}
      <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
        <h1 className="text-foreground mb-6 text-3xl font-bold">Question Bank</h1>
        <div className="space-y-3">
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{Math.round(stats.percentComplete)}% Complete</span>
          </div>
          <div className="bg-muted h-3 overflow-hidden rounded-full">
            {stats.total > 0 ? (
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `100%`,
                  background: `linear-gradient(to right, #22c55e 0%, #22c55e ${stats.greenEnd}%, #ef4444 ${stats.greenEnd}%, #ef4444 ${stats.redEnd}%, #9ca3af ${stats.redEnd}%, #9ca3af 100%)`,
                }}
              />
            ) : (
              <div className="h-full rounded-full bg-slate-300/40" />
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-green-600">{stats.correct} Correct</span>
            <span className="text-muted-foreground">
              {stats.attempted} of {stats.total} completed
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
              className="border-input focus:border-ring focus:ring-ring rounded-lg py-2 pr-3 pl-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-4 flex md:justify-end justify-start pl-4 md:pl-0">
            <label className="flex items-center space-x-0 md:space-x-14">
              <Checkbox
                className="border-border h-5 w-5 cursor-pointer appearance-none border-1"
                checked={reattemptWrongOnly}
                onCheckedChange={() => setReattemptWrongOnly(!reattemptWrongOnly)}
              />
              <span className="text-muted-foreground">Re-attempt Wrong Only</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-foreground mb-4 text-lg font-medium">Select Categories</h3>
          <div className="scrollbar-thin max-h-[250px] overflow-y-auto p-1 pr-2 md:max-h-[350px]">
            {categories === undefined ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border-border overflow-hidden rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-5 w-48" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                    <div className="border-border mt-4 border-t pt-4">
                      <Skeleton className="h-6 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCategories.length === 0 ? (
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
        </div>

        <div className="border-border mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="cursor-pointer rounded-lg px-8 py-6 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
              onClick={() => handleStartSession(reattemptWrongOnly)}
            >
              Start Session
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={isExamModeEnabled ? "default" : "outline"}
                  size="sm"
                  className="h-12 px-4"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Exam Mode
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 space-y-4">
                <div>
                  <p className="text-sm font-semibold">Exam Settings</p>
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <p className="text-sm font-medium">Enable Exam Mode</p>
                  <Checkbox
                    className="h-5 w-5 cursor-pointer appearance-none border-1 border-black"
                    checked={isExamModeEnabled}
                    onCheckedChange={(checked) => setIsExamModeEnabled(checked === true)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Question Count</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustQuestionCount("dec")}
                        disabled={!isExamModeEnabled || sessionQuestionLimit <= MIN_EXAM_QUESTIONS}
                        aria-label="Decrease question count"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center text-sm font-semibold">
                        {sessionQuestionLimit}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustQuestionCount("inc")}
                        disabled={!isExamModeEnabled || sessionQuestionLimit >= MAX_EXAM_QUESTIONS}
                        aria-label="Increase question count"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">Time Limit</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustDurationMinutes("dec")}
                        disabled={!isExamModeEnabled || timerMinutes <= MIN_EXAM_MINUTES}
                        aria-label="Decrease time limit"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-14 text-center text-sm font-semibold">
                        {timerMinutes}m
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => adjustDurationMinutes("inc")}
                        disabled={!isExamModeEnabled || timerMinutes >= MAX_EXAM_MINUTES}
                        aria-label="Increase time limit"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Total Selected Question Bubble */}
          {categories && categories.categories.length > 0 && (
            <div>
              {(() => {
                let totalSelectedQuestions = 0;
                if (selectedCategoriesId.length === 0 && selectedSubCategoryId.length === 0) {
                  totalSelectedQuestions = 0;
                } else {
                  categories.categories.forEach((cat) => {
                    if (selectedCategoriesId.includes(cat.id)) {
                      totalSelectedQuestions += cat.question_count || 0;
                    } else {
                      const selectedSubcats =
                        cat.sub_categories?.filter((sub) =>
                          selectedSubCategoryId.includes(sub.id)
                        ) || [];
                      totalSelectedQuestions += selectedSubcats.reduce(
                        (acc, sub) => acc + (sub.question_count || 0),
                        0
                      );
                    }
                  });
                }

                return (
                  <div className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 flex items-center gap-3 rounded-full border px-5 py-2 text-sm font-semibold shadow-sm transition-all">
                    <span> Selected Questions</span>
                    <span className="bg-primary text-primary-foreground flex h-6 items-center justify-center rounded-full px-3 text-xs font-bold shadow-sm">
                      {totalSelectedQuestions}
                    </span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {continueModal}
    </section>
  );
};

export default QuestionBankSection;
