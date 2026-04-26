import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Bookmark, Lightbulb, Loader2, Share2 } from "lucide-react";
import { useQuestionPageController } from "@/hooks/user/useQuestionPage";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import { getImageUrl } from "@/config/apiConfig";
import QuestionReview from "@/components/user/QuestionReview";
import { toast } from "sonner";
import EditorRenderer from "@/components/EditorRenderer";

const QuestionPage = () => {
  const {
    currentQuestion,
    questionData,
    currentIndex,
    totalCount,
    attempts,
    currentAttempt,
    isAttempted,
    selectedOptions,
    selectedOption,
    remainingMs,
    isSavingAnswer,
    isSubmittingSession,
    showReview,
    reviewQuestions,
    isExamModeEnabled,
    isFetchingNextPage,
    handleOptionSelect,
    handleBack,
    handleReviewDone,
    handlePreviousQuestion,
    handleNextQuestion,
    handleAttemptQuestion,
    handleBookmarkToggle,
    isBookmarked,
  } = useQuestionPageController();

  const formatRemainingTime = (milliseconds: number) => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const getQuestionProgressStatus = (index: number) => {
    const question = questionData?.[index];
    if (!question) return "pending";

    const attempt = attempts[question.id];
    if (!attempt?.isAttempted) return "pending";

    return attempt.isCorrect ? "correct" : "incorrect";
  };

  if (showReview && isExamModeEnabled) {
    return (
      <QuestionReview questions={reviewQuestions} attempts={attempts} onDone={handleReviewDone} />
    );
  }

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

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleBookmarkToggle}
              className="hover:bg-muted text-muted-foreground bg-card px-4 py-2"
            >
              <Bookmark
                className={`mr-2 h-4 w-4 ${isBookmarked ? "text-primary fill-current" : ""}`}
              />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
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

        {!isExamModeEnabled && totalCount > 0 && (
          <div className="bg-card rounded-lg border p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Session Progress</p>
              <p className="text-muted-foreground text-xs">Green = correct, Red = incorrect</p>
            </div>

            <div className="overflow-x-auto overflow-y-visible px-1 py-2">
              <div className="flex min-w-max items-center pr-1">
                {Array.from({ length: totalCount }).map((_, index) => {
                  const status = getQuestionProgressStatus(index);
                  const isCurrent = index === currentIndex;

                  const bubbleClasses =
                    status === "correct"
                      ? "border-green-600 bg-green-500 text-white"
                      : status === "incorrect"
                        ? "border-red-600 bg-red-500 text-white"
                        : "border-border bg-muted text-muted-foreground";

                  const lineClasses =
                    status === "correct"
                      ? "bg-green-500/70"
                      : status === "incorrect"
                        ? "bg-red-500/70"
                        : "bg-border";

                  return (
                    <div key={`progress-${index}`} className="flex items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${bubbleClasses} ${
                          isCurrent
                            ? "ring-primary ring-offset-background ring-2 ring-offset-1"
                            : ""
                        }`}
                      >
                        {index + 1}
                      </div>

                      {index < totalCount - 1 && <div className={`h-0.5 w-7 ${lineClasses}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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
                      disabled={
                        isExamModeEnabled ? isSavingAnswer || isSubmittingSession : isAttempted
                      }
                      correctOptions={
                        isExamModeEnabled ? [] : (currentAttempt?.correctOptions ?? [])
                      }
                      showResultStyles={!isExamModeEnabled}
                    />
                  ))
                : currentQuestion.options.map((option) => (
                    <SingleChoiceOption
                      key={option.label}
                      option={option}
                      handleOptionSelect={handleOptionSelect}
                      selectedOption={selectedOption}
                      disabled={
                        isExamModeEnabled ? isSavingAnswer || isSubmittingSession : isAttempted
                      }
                      correctOptions={
                        isExamModeEnabled ? [] : (currentAttempt?.correctOptions ?? [])
                      }
                      radioName={`question-${currentQuestion.id}`}
                      showResultStyles={!isExamModeEnabled}
                    />
                  ))}
            </div>

            {!isExamModeEnabled && isAttempted && (
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
                    <EditorRenderer
                      data={currentQuestion.description}
                      className="text-foreground"
                    />
                    {currentQuestion.description_image_url && (
                      <div className="flex justify-center">
                        <img
                          src={getImageUrl(currentQuestion.description_image_url)}
                          alt="Question explanation"
                          className="max-h-72 w-auto max-w-full rounded-lg object-contain shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
            {isExamModeEnabled ? (
              <Button
                onClick={handleNextQuestion}
                disabled={isFetchingNextPage || isSavingAnswer || isSubmittingSession}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2"
              >
                {isSavingAnswer || isSubmittingSession || isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>Processing...</p>
                  </>
                ) : currentIndex + 1 >= totalCount ? (
                  <p>Submit</p>
                ) : (
                  <>
                    <p>Next</p>
                    <ArrowRight />
                  </>
                )}
              </Button>
            ) : !isAttempted ? (
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
