import { Button } from "@/components/ui/button";
import { useQuestions } from "@/hooks/useQuestions";
import { useState, useEffect, useRef } from "react"; //React,
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Lightbulb, Loader2, Share2 } from "lucide-react";
import { attemptQuestion } from "@/services/user/question-service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Question, QuestionAttemptState } from "@/types/question";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import EditorRenderer from "@/components/EditorRenderer";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/config/apiConfig";
import { getEffectiveQuestionCount } from "@/utils/examModeUtils";

const QuestionPage = () => {
  const { token } = useAuth();
  const {
    questionData,
    questionPagination,
    fetchNextPage,
    isFetchingNextPage,
    isExamModeEnabled,
    sessionQuestionLimit,
    sessionEndsAtMs,
    clearSessionTimer,
    resetQuestionSelection,
  } = useQuestions();
  const navigate = useNavigate();

  // use an index instead of storing whole object
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  // single source for per-question state
  const [attempts, setAttempts] = useState<{ [id: string]: QuestionAttemptState }>({});

  // track the data length from the previous render to distinguish a fresh fetch from a page append
  const prevDataLengthRef = useRef(0);
  const timeoutHandledRef = useRef(false);

  // derive currentQuestion from index and questionData
  const currentQuestion: Question | null =
    questionData && questionData.length > 0 ? questionData[currentIndex] || null : null;

  useEffect(() => {
    window.scrollTo(0, 0);

    const prevLength = prevDataLengthRef.current;
    prevDataLengthRef.current = questionData?.length ?? 0;

    if (!questionData || questionData.length === 0) {
      setCurrentIndex(0);
      return;
    }

    // If the new length is greater than before, this is a page append — keep the current index.
    // Otherwise it's a fresh session fetch — reset everything.
    if (questionData.length > prevLength) return;

    setCurrentIndex(0);
    setSelectedOptions([]);
    setSelectedOption("");
  }, [questionData]);

  useEffect(() => {
    timeoutHandledRef.current = false;

    if (!sessionEndsAtMs) {
      setRemainingMs(null);
      return;
    }

    const updateRemaining = () => {
      const timeLeft = Math.max(0, sessionEndsAtMs - Date.now());
      setRemainingMs(timeLeft);

      if (timeLeft > 0 || timeoutHandledRef.current) return;

      timeoutHandledRef.current = true;
      clearSessionTimer();
      resetQuestionSelection();
      toast.error("Time is up. Session ended.");
      navigate("/userpanel");
    };

    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [sessionEndsAtMs, clearSessionTimer, navigate, resetQuestionSelection]);

  // keep UI selections synchronized with saved attempt for the current question
  useEffect(() => {
    if (!currentQuestion) return;
    const savedAttempt = attempts[currentQuestion.id];
    if (currentQuestion.option_type === "multiple") {
      setSelectedOptions(savedAttempt?.selectedOptions ?? []);
      setSelectedOption("");
    } else {
      setSelectedOption(savedAttempt?.selectedOption ?? "");
      setSelectedOptions([]);
    }
  }, [currentIndex, attempts, questionData, currentQuestion]);

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    // validate selection before going next
    if (
      (currentQuestion.option_type === "multiple" && selectedOptions.length === 0) ||
      (currentQuestion.option_type === "single" && selectedOption === "")
    ) {
      toast.error("Please select an option before proceeding.");
      return;
    }

    const totalAvailable = questionPagination?.count ?? questionData.length;
    const totalCount = isExamModeEnabled
      ? getEffectiveQuestionCount(sessionQuestionLimit, totalAvailable)
      : totalAvailable;
    const nextIndex = currentIndex + 1;

    if (nextIndex >= totalCount) {
      toast.info("You've completed all questions!");
      clearSessionTimer();
      resetQuestionSelection();
      navigate("/userpanel");
      return;
    }

    if (!questionData || nextIndex >= questionData.length) {
      // try to load the next page if available
      if (questionPagination?.next && questionData.length < totalCount) {
        await fetchNextPage();
        setCurrentIndex(nextIndex);
      } else {
        toast.info("You've completed all questions!");
        clearSessionTimer();
        resetQuestionSelection();
        navigate("/userpanel");
      }
      return;
    }
    setCurrentIndex(nextIndex);
  };

  const handlePreviousQuestion = () => {
    if (!questionData || questionData.length === 0 || currentIndex === 0) return;
    setCurrentIndex(currentIndex - 1);
  };

  const handleAttemptQuestion = async (question: Question) => {
    if (!token) {
      console.error("No token available");
      return;
    }

    /*
      For multiple choice question: [option1, option2]
      For single choice question: [option1] or []
    */
    const selected =
      question.option_type === "multiple"
        ? selectedOptions
        : selectedOption
          ? [selectedOption]
          : [];

    if (!selected || selected.length === 0) {
      toast.error("Please select an option before attempting the question.");
      return;
    }

    try {
      const result = await attemptQuestion(question.id, selected);

      if (!result) {
        toast.error("Something wrong occurred. Try again.");
        navigate("/");
        return;
      }

      // save the attempt (selected choices, attempt flag, correctness)
      setAttempts((prev) => ({
        ...prev,
        [question.id]: {
          selectedOptions: selected,
          selectedOption: question.option_type === "multiple" ? undefined : selected[0],
          isAttempted: true,
          feedback: result?.feedback ?? "",
          correctOptions: result?.correct_answers,
        },
      }));

      if (result.is_correct) {
        toast.success("Correct answer!");
      } else {
        toast.error("Incorrect answer. Try again!");
      }
    } catch (error) {
      console.error("Error attempting question:", error);
    }
  };

  const handleBack = () => {
    clearSessionTimer();
    resetQuestionSelection();
    navigate("/userpanel");
  };

  const formatRemainingTime = (milliseconds: number) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  if (!currentQuestion) {
    if (isFetchingNextPage) {
      return (
        <div className="flex min-h-screen items-center justify-center gap-3">
          <Loader2 className="text-primary h-6 w-6 animate-spin" />
          <p className="text-muted-foreground text-lg">Loading next questions...</p>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-lg">
          No questions available. Please select categories.
        </p>
      </div>
    );
  }

  const handleOptionSelect = (label: string) => {
    if (currentQuestion.option_type === "multiple") {
      setSelectedOptions((prev) =>
        prev.includes(label) ? prev.filter((id) => id !== label) : [...prev, label]
      );
    } else {
      setSelectedOption(label);
    }
  };

  // Derived UI flags from the attempts map
  const currentAttempt = currentQuestion ? attempts[currentQuestion.id] : undefined;
  const isAttempted = !!currentAttempt?.isAttempted;

  // total question count respects exam-mode question limit and backend availability
  const totalAvailable = questionPagination?.count ?? questionData.length;
  const totalCount = isExamModeEnabled
    ? getEffectiveQuestionCount(sessionQuestionLimit, totalAvailable)
    : totalAvailable;

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="hover:bg-muted text-muted-foreground bg-card px-4 py-2"
          >
            <ArrowLeft />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const url = `${window.location.origin}/shared/question/${currentQuestion.id}`;
              navigator.clipboard.writeText(url);
              toast.success("Link copied to clipboard!");
            }}
            className="hover:bg-muted text-muted-foreground bg-card px-4 py-2"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-3xl font-bold">Entrance Preparation Test</h1>
          <div className="flex items-center gap-3">
            {remainingMs !== null && (
              <span className="bg-muted text-foreground rounded-md px-3 py-1 text-sm font-semibold">
                Time Left: {formatRemainingTime(remainingMs)}
              </span>
            )}
            <span className="text-muted-foreground text-sm font-medium">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-foreground text-xl leading-relaxed font-semibold">
              {currentQuestion.question_text}
            </h2>
            {currentQuestion.question_image_url && (
              <div className="flex justify-center">
                <img
                  src={getImageUrl(currentQuestion.question_image_url)}
                  alt="Question illustration"
                  className="max-h-72 w-auto max-w-full rounded-lg border object-contain shadow-md"
                />
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-4">
              {currentQuestion.option_type === "multiple"
                ? currentQuestion.options.map((option) => (
                    <MultipleChoiceOption
                      key={option.label}
                      option={option}
                      handleOptionSelect={handleOptionSelect}
                      selectedOptions={selectedOptions}
                      disabled={isAttempted}
                      correctOptions={currentAttempt?.correctOptions ?? []}
                    />
                  ))
                : currentQuestion.options.map((option) => (
                    <SingleChoiceOption
                      key={option.label}
                      option={option}
                      handleOptionSelect={handleOptionSelect}
                      selectedOption={selectedOption}
                      disabled={isAttempted}
                      correctOptions={currentAttempt?.correctOptions ?? []}
                    />
                  ))}
            </div>
          </CardContent>
        </Card>

        {/* Explanation */}
        {isAttempted && (
          <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0">
                <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <Lightbulb size={18} className="text-primary-foreground" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-primary flex items-center text-sm font-semibold">
                  Explanation
                </h3>
                <EditorRenderer data={currentQuestion.description} className="text-foreground" />
                {currentQuestion.description_image_url && (
                  <div className="flex justify-center">
                    <img
                      src={getImageUrl(currentQuestion.description_image_url)}
                      alt="Question illustration"
                      className="max-h-72 w-auto max-w-full rounded-lg object-contain shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contributor */}
        {currentQuestion?.contributor && (
          <div className="text-muted-foreground text-right text-sm">
            <div>{currentQuestion.contributor}</div>
            {currentQuestion.contributor_specialization && (
              <div className="text-xs">{currentQuestion.contributor_specialization}</div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            className="hover:bg-muted text-muted-foreground bg-card px-6 py-2"
          >
            <ArrowLeft />
            <p>Previous</p>
          </Button>

          <div className="flex items-center gap-4">
            {!isAttempted ? (
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
                onClick={() => handleAttemptQuestion(currentQuestion)}
                disabled={
                  currentQuestion.option_type === "multiple"
                    ? selectedOptions.length === 0
                    : selectedOption === ""
                }
              >
                Attempt
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={isFetchingNextPage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>Loading...</p>
                  </>
                ) : (
                  <>
                    <p>Next</p>
                    <ArrowRight />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="text-center">
          <Button variant="destructive" size="lg" className="px-8 py-3" onClick={handleBack}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
