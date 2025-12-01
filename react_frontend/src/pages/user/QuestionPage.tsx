import { Button } from "@/components/ui/button";
import { useQuestions } from "@/hooks/useQuestions";
import { useState, useEffect } from "react"; //React,
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { attemptQuestion } from "@/services/user/questionService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Question, QuestionAttemptState } from "@/types/question";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import { useNavigate } from "react-router-dom";

const QuestionPage = () => {
  const { token } = useAuth();
  const { questionData } = useQuestions();
  const navigate = useNavigate();

  // use an index instead of storing whole object
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");

  // single source for per-question state
  const [attempts, setAttempts] = useState<{ [id: string]: QuestionAttemptState }>({});

  // derive currentQuestion from index and questionData
  const currentQuestion: Question | null =
    questionData && questionData.length > 0 ? questionData[currentIndex] || null : null;

  useEffect(() => {
    // reset index and UI if questionData changes
    if (!questionData || questionData.length === 0) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(0);
    setSelectedOptions([]);
    setSelectedOption("");
  }, [questionData]);

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
  }, [currentIndex, attempts, questionData]);

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    // if (!token) {
    //   console.error("No token available");
    //   return;
    // }

    // validate selection before going next
    if (
      (currentQuestion.option_type === "multiple" && selectedOptions.length === 0) ||
      (currentQuestion.option_type === "single" && selectedOption === "")
    ) {
      toast.error("Please select an option before proceeding.");
      return;
    }

    const nextIndex = currentIndex + 1;

    if (!questionData || nextIndex >= questionData.length) {
      toast.info("You've completed all questions!");
      navigate("/userpanel");
      return;
    }
    setCurrentIndex(nextIndex);
  };

  const handlePreviousQuestion = () => {
    if (!questionData || questionData.length === 0) return;
    const prevIndex = (currentIndex - 1 + questionData.length) % questionData.length;
    setCurrentIndex(prevIndex);
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
    let selected =
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
      const result = await attemptQuestion(question.id, selected, token);

      if (!result) {
        toast.error("Something wrong occurred. Try again.")
        navigate("/")
        return
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

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          No questions available. Please select categories.
        </p>
      </div>
    );
  }

  const handleOptionSelect = (label: string) => {
    if (currentQuestion.option_type === "multiple") {
      setSelectedOptions((prev) =>
        prev.includes(label)
          ? prev.filter((id) => id !== label)
          : [...prev, label]
      );
    } else {
      setSelectedOption(label);
    }
  };

  // Derived UI flags from the attempts map
  const currentAttempt = currentQuestion ? attempts[currentQuestion.id] : undefined;
  const isAttempted = !!currentAttempt?.isAttempted;
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Entrance Preparation Test
          </h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="capitalize">
                {currentQuestion.category}
              </Badge>
              <Badge
                variant={
                  currentQuestion.difficulty === "easy"
                    ? "default"
                    : currentQuestion.difficulty === "medium"
                    ? "secondary"
                    : "destructive"
                }
                className="capitalize"
              >
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {currentQuestion.option_type}
              </Badge>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {currentQuestion.question_text}
            </h2>
            {currentQuestion.question_image_url && (
              <div className="flex justify-center">
                <img
                  src={currentQuestion.question_image_url}
                  alt="Question illustration"
                  className="border max-w-full h-auto rounded-lg shadow-md"
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

            {isAttempted && (
              <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-5 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Lightbulb size={18} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center">
                      Explanation
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                      {currentQuestion.description}
                    </p>
                    {currentQuestion.description_image_url && (
                      <div className="flex justify-center">
                        <img
                          src={currentQuestion.description_image_url}
                          alt="Question illustration"
                          className="max-w-full h-auto rounded-lg shadow-md"
                          />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contributor Display */}
        {currentQuestion?.contributor && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentQuestion.contributor } - {currentQuestion.contributor_specialization}
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            className="px-6 py-2 hover:bg-gray-100"
          >
            <ArrowLeft />
            <p>Previous</p>
          </Button>

          {!isAttempted ? (
            <Button
              className="mt-6 bg-blue-600 hover:bg-blue-700"
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
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
            >
              <p>Next</p>
              <ArrowRight />
            </Button>
          )}
        </div>

        <div className="text-center">
          <Button variant="destructive" size="lg" className="px-8 py-3">
            Submit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
