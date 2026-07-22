import { Minus, Plus, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
//import { getCategories } from "@/services/user/questionService.ts";
import { toast } from "sonner";
import { useQuestions } from "@/hooks/useQuestions.tsx";
import CategoryList from "./CategoryList";
import type { Category, GetCategoriesResponse } from "@/types/category";
import { getCategories, getQuestionsByIds } from "@/services/user/question-service";
import { getSubmissionHistory } from "@/services/user/history-service";
import { SUBMISSION_PAGE_SIZE } from "@/utils/historyUtils";
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
  } = useQuestions(); //selectedSubSubCategoryId,
  const navigate = useNavigate();

  const [categories, setCategories] = useState<GetCategoriesResponse>();
  const [reattemptWrongOnly, setReattemptWrongOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRetryModal, setShowRetryModal] = useState(false);
  const retryResolveRef = useRef<((val: boolean) => void) | null>(null);

  const timerMinutes = Math.floor(sessionTimerSeconds / 60);

  useEffect(() => {
    if (!token) return;
    const getCategoriesData = async () => {
      try {
        const categoryResponse = await getCategories();

        setCategories(categoryResponse);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories({ total_questions: 0, categories: [] });
        toast.error("Failed to fetch categories");
      }
    };
    getCategoriesData();
  }, [token]);

  const askRetryConfirm = (): Promise<boolean> =>
    new Promise((resolve) => {
      retryResolveRef.current = resolve;
      setShowRetryModal(true);
    });

  const handleStartSession = async (reattemptWrongOnly: boolean) => {
    if (isExamModeEnabled) {
      startSessionTimer(sessionTimerSeconds);
      await fetchQuestions(reattemptWrongOnly);
      navigate("/userpanel/question");
      return;
    } else {
      clearSessionTimer();
    }

    const startMode = await getQuestionBankStartMode();

    if (startMode === "retry") {
      const wantsRetry = await askRetryConfirm();
      if (!wantsRetry) {
        return;
      }
    }

    if (startMode === "resume") {
      navigate("/userpanel/question");
      return;
    }

    await fetchQuestions(reattemptWrongOnly);
    navigate("/userpanel/question");
  };

  const getQuestionBankStartMode = async (): Promise<"resume" | "retry" | "new"> => {
    try {
      const submissions = await getSubmissionHistory("question_bank", {
        pageSize: SUBMISSION_PAGE_SIZE,
        maxPages: 5,
      });
      const activeSubmission = submissions.find((submission) => {
        return submission.status === "in_progress";
      });

      if (!activeSubmission?.selected_question_ids?.length) {
        const latestSubmission = submissions[0];
        if (latestSubmission?.status === "submitted") {
          return "retry";
        }
        return "new";
      }

      const questions = await getQuestionsByIds(activeSubmission.selected_question_ids);
      if (questions.length === 0) {
        return "new";
      }

      const attemptResults = (activeSubmission.attempts ?? []).map((attempt) =>
        attempt?.is_correct === true ? true : attempt?.is_correct === false ? false : null
      );

      setSessionQuestions(
        questions,
        activeSubmission.submission_id,
        activeSubmission.attempts?.length ?? 0,
        attemptResults
      );
      return "resume";
    } catch (error) {
      console.error("Failed to resume question bank session:", error);
      return "new";
    }
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
              className="border-input focus:border-ring focus:ring-ring rounded-lg py-3 pr-4 pl-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <label className="flex items-center space-x-14">
              <Checkbox
                className="h-5 w-5 cursor-pointer appearance-none border-1 border-border"
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

      {/* All Questions Complete — Retry Modal */}
      {showRetryModal && (
        <div
          className="animate-in fade-in fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm duration-150"
          onClick={() => {
            setShowRetryModal(false);
            retryResolveRef.current?.(false);
          }}
        >
          <div
            className="bg-background animate-in slide-in-from-bottom-4 flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl p-8 shadow-2xl duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <RefreshCw size={24} color="#4f6bff" />
            </div>

            {/* Title */}
            <h2 className="text-foreground text-xl font-bold">All Questions Complete</h2>

            {/* Message */}
            <p className="text-muted-foreground my-1 mb-4 text-center text-sm leading-relaxed">
              Do you want to retry the same questions?
            </p>

            {/* Buttons */}
            <div className="flex w-full gap-3">
              <button
                onClick={() => {
                  setShowRetryModal(false);
                  retryResolveRef.current?.(false);
                }}
                className="border-border text-foreground hover:bg-muted flex-1 rounded-lg border-2 bg-transparent py-2.5 text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRetryModal(false);
                  retryResolveRef.current?.(true);
                }}
                className="bg-primary hover:bg-primary/90 flex-1 rounded-lg border-0 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuestionBankSection;
