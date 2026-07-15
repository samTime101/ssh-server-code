import { Button } from "@/components/ui/button";
import { useQuestions } from "@/hooks/useQuestions";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { attemptQuestion, submitSubmission } from "@/services/user/question-service";
import { toast } from "sonner";
import type { Question, QuestionAttemptState } from "@/types/question";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import EditorRenderer from "@/components/EditorRenderer";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "@/config/apiConfig";
import QuestionFeedbackWidget from "@/components/user/QuestionFeedbackWidget";
import ScoreSummaryModal from "@/components/user/ScoreSummaryModal";
import { calculateScore } from "@/utils/scoreCalculation";
import { useQuestionResponseTimer } from "@/hooks/user/useQuestionResponseTimer";

const CEEQuestionPage = () => {
  const { questionData, currentSubmissionId, resetQuestionSelection } = useQuestions();
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [attempts, setAttempts] = useState<{ [id: string]: QuestionAttemptState }>({});
  const [showScoreModal, setShowScoreModal] = useState(false);

  const currentQuestion: Question | null =
    questionData && questionData.length > 0 ? questionData[currentIndex] || null : null;

  const { getResponseTimeSeconds, resetTimer } = useQuestionResponseTimer(currentQuestion?.id);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!questionData || questionData.length === 0) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(0);
    setSelectedOptions([]);
    setSelectedOption("");
  }, [questionData]);

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
  }, [currentQuestion, attempts]);

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    if (
      (currentQuestion.option_type === "multiple" && selectedOptions.length === 0) ||
      (currentQuestion.option_type === "single" && selectedOption === "")
    ) {
      toast.error("Please select an option before proceeding.");
      return;
    }

    const nextIndex = currentIndex + 1;
    if (!questionData || nextIndex >= questionData.length) {
      // All questions completed - submit and show score
      await handleSubmitTest();
      return;
    }
    setCurrentIndex(nextIndex);
  };

  const handlePreviousQuestion = () => {
    if (!questionData || questionData.length === 0) return;
    const prevIndex = (currentIndex - 1 + questionData.length) % questionData.length;
    setCurrentIndex(prevIndex);
  };

  const handleBack = () => {
    resetQuestionSelection();
    navigate("/userpanel/cee-practice");
  };

  const handleSubmitTest = async () => {
    if (!currentSubmissionId) {
      toast.error("No active submission found.");
      return;
    }

    // Check for unattempted questions
    const attemptedCount = Object.values(attempts).filter((a) => a.isAttempted).length;
    const totalQuestions = questionData?.length || 0;

    if (attemptedCount < totalQuestions) {
      const unattemptedCount = totalQuestions - attemptedCount;
      const confirmSubmit = window.confirm(
        `You have ${unattemptedCount} unattempted question${unattemptedCount > 1 ? "s" : ""}. Are you sure you want to submit?`
      );
      if (!confirmSubmit) {
        return;
      }
    }

    try {
      const result = await submitSubmission(currentSubmissionId);
      if (result) {
        toast.success("Test submitted successfully!");
        setShowScoreModal(true);
      } else {
        toast.error("Failed to submit test. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("An error occurred while submitting the test.");
    }
  };

  const handleReturnToHome = () => {
    setShowScoreModal(false);
    resetQuestionSelection();
    navigate("/userpanel/cee-practice");
  };

  const handleAttemptQuestion = async (question: Question) => {
    if (!currentSubmissionId) {
      toast.error("No active submission found. Please start a new session.");
      return;
    }

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
      const result = await attemptQuestion(
        currentSubmissionId,
        question.id,
        selected,
        getResponseTimeSeconds()
      );

      if (!result) {
        toast.error("Something wrong occurred. Try again.");
        navigate("/");
        return;
      }

      resetTimer();

      setAttempts((prev) => ({
        ...prev,
        [question.id]: {
          selectedOptions: selected,
          selectedOption: question.option_type === "multiple" ? undefined : selected[0],
          isAttempted: true,
          feedback: result?.detail ?? "",
          correctOptions: result?.correct_answers,
          actualAnswers: result?.actual_answers ?? [],
          isCorrect: result.is_correct,
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

  if (!currentQuestion) {
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

  const currentAttempt = currentQuestion ? attempts[currentQuestion.id] : undefined;
  const isAttempted = !!currentAttempt?.isAttempted;

  // Calculate score data for the modal
  const scoreData = questionData ? calculateScore(attempts, questionData.length) : null;

  return (
    <div className="min-h-screen p-6">
      {scoreData && (
        <ScoreSummaryModal
          isOpen={showScoreModal}
          onClose={() => setShowScoreModal(false)}
          scoreData={scoreData}
          onReturnToHome={handleReturnToHome}
          // onReviewAnswers={handleReviewAnswers}
        />
      )}
      <div className="mx-auto max-w-4xl space-y-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="hover:bg-muted text-muted-foreground px-4 py-2"
        >
          <ArrowLeft />
          Back
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-3xl font-bold">CEE Practice</h1>
          <div className="flex items-center gap-4">
            <div className="text-muted-foreground text-right text-sm">
              <div>
                Question {currentIndex + 1} of {questionData?.length || 0}
              </div>
              <div className="text-xs">
                Attempted: {Object.values(attempts).filter((a) => a.isAttempted).length} /{" "}
                {questionData?.length || 0}
              </div>
            </div>
          </div>
        </div>

        <Card className="relative overflow-visible shadow-lg">
          <CardHeader className="pb-4">
            {currentQuestion.category_names &&
              currentQuestion.category_names.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {currentQuestion.category_names.map((category, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
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
                      correctOptions={
                        currentAttempt?.isCorrect === false
                          ? (currentAttempt?.actualAnswers ?? [])
                          : (currentAttempt?.correctOptions ?? [])
                      }
                    />
                  ))
                : currentQuestion.options.map((option) => (
                    <SingleChoiceOption
                      key={option.label}
                      option={option}
                      handleOptionSelect={handleOptionSelect}
                      selectedOption={selectedOption}
                      disabled={isAttempted}
                      correctOptions={
                        currentAttempt?.isCorrect === false
                          ? (currentAttempt?.actualAnswers ?? [])
                          : (currentAttempt?.correctOptions ?? [])
                      }
                    />
                  ))}
            </div>
            <QuestionFeedbackWidget questionId={currentQuestion.id} />

            {isAttempted && (
              <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                      <Lightbulb size={18} className="text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-primary flex items-center text-xl font-bold">
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
                          alt="Question illustration"
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

        {currentQuestion?.contributor && (
          <div className="text-muted-foreground text-sm">
            {currentQuestion.contributor} - {currentQuestion.contributor_specialization}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            className="hover:bg-muted text-muted-foreground px-6 py-2"
          >
            <ArrowLeft />
            <p>Previous</p>
          </Button>

          <div className="flex gap-3">
            {!isAttempted ? (
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
              <>
                {currentIndex < questionData.length - 1 ? (
                  <Button
                    onClick={handleNextQuestion}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2"
                  >
                    <p>Next</p>
                    <ArrowRight />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitTest}
                    className="bg-green-600 px-6 py-2 text-white hover:bg-green-700"
                  >
                    Submit Test
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEEQuestionPage;
