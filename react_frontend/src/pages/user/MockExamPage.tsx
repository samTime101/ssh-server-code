import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuestions } from "@/hooks/useQuestions";
import { fetchQuestionSets, fetchQuestionSetSession } from "@/services/admin/questionset-service";
import { attemptQuestion } from "@/services/user/question-service";
import type { Question, QuestionAttemptState } from "@/types/question";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import { getImageUrl } from "@/config/apiConfig";

const MockExamPage = () => {
  const navigate = useNavigate();
  const { setSessionQuestions, questionData, currentSubmissionId, resetQuestionSelection } =
    useQuestions();

  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [attempts, setAttempts] = useState<{ [id: string]: QuestionAttemptState }>({});

  useEffect(() => {
    const loadRandomExam = async () => {
      setIsLoading(true);
      try {
        const { sets } = await fetchQuestionSets();
        if (!sets || sets.length === 0) {
          toast.error("No exam sets available.");
          setIsLoading(false);
          return;
        }
        const randomSet = sets[Math.floor(Math.random() * sets.length)];
        const session = await fetchQuestionSetSession(randomSet.id);
        const validQuestions = session.results ?? [];

        if (validQuestions.length === 0) {
          toast.error("The selected random set has no questions.");
          setIsLoading(false);
          return;
        }
        setSessionQuestions(validQuestions, session.submission_id ?? null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load mock exam.");
      } finally {
        setIsLoading(false);
      }
    };

    loadRandomExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion: Question | null =
    questionData && questionData.length > 0 ? questionData[currentIndex] || null : null;

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    if (
      !attempts[currentQuestion.id]?.isAttempted &&
      ((currentQuestion.option_type === "multiple" && selectedOptions.length === 0) ||
        (currentQuestion.option_type === "single" && selectedOption === ""))
    ) {
      toast.error("Please answer the question before proceeding.");
      return;
    }

    const nextIndex = currentIndex + 1;
    if (!questionData || nextIndex >= questionData.length) {
      toast.info("You've completed all questions!");
      handleExit();
      return;
    }
    setCurrentIndex(nextIndex);
  };

  const handleAttemptQuestion = async (question: Question) => {
    if (!currentSubmissionId) {
      toast.error("No active submission found.");
      return;
    }

    const selected =
      question.option_type === "multiple"
        ? selectedOptions
        : selectedOption
          ? [selectedOption]
          : [];

    if (!selected || selected.length === 0) {
      toast.error("Please select an option before attempting.");
      return;
    }

    try {
      const result = await attemptQuestion(currentSubmissionId, question.id, selected);
      if (!result) return;

      setAttempts((prev) => ({
        ...prev,
        [question.id]: {
          selectedOptions: selected,
          selectedOption: question.option_type === "multiple" ? undefined : selected[0],
          isAttempted: true,
          feedback: result?.detail ?? "",
          correctOptions: result?.correct_answers,
        },
      }));
    } catch (error) {
      console.error("Error attempting question:", error);
    }
  };

  const handleOptionSelect = (label: string) => {
    if (!currentQuestion) return;
    if (currentQuestion.option_type === "multiple") {
      setSelectedOptions((prev) =>
        prev.includes(label) ? prev.filter((id) => id !== label) : [...prev, label]
      );
    } else {
      setSelectedOption(label);
    }
  };

  const handleExit = () => {
    resetQuestionSelection();
    navigate("/userpanel");
  };

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-foreground text-xl font-semibold">Loading your mock exam...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-lg">No questions available.</p>
        <Button onClick={handleExit} className="ml-4">
          Go Back
        </Button>
      </div>
    );
  }

  const totalQuestions = questionData.length;
  const currentAttempt = attempts[currentQuestion.id];
  const isAttempted = !!currentAttempt?.isAttempted;

  return (
    <div className="bg-background flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header & Progress */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleExit}
              className="hover:bg-muted text-muted-foreground px-4 py-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Exam
            </Button>
            <div className="text-foreground font-medium">
              {currentIndex + 1} / {totalQuestions}
            </div>
          </div>
          <progress
            value={currentIndex + 1}
            max={totalQuestions}
            className="[&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary h-3 w-full appearance-none overflow-hidden rounded-full"
          />
        </div>

        {/* Question Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-foreground text-xl leading-relaxed font-semibold">
              {currentQuestion.question_text}
            </h2>
            {currentQuestion.question_image_url && (
              <div className="mt-4 flex justify-center">
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

            <div className="flex justify-end gap-4 pt-6">
              {!isAttempted ? (
                <Button onClick={() => handleAttemptQuestion(currentQuestion)}>
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="bg-primary text-primary-foreground">
                  {currentIndex + 1 === totalQuestions ? "Finish Exam" : "Next Question"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MockExamPage;
