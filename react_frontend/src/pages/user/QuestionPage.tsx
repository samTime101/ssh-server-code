import { Button } from "@/components/ui/button";
import { useQuestions } from "@/hooks/useQuestions";
import { useState, useEffect } from "react"; //React,
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Lightbulb, Info } from "lucide-react";
import { attemptQuestion } from "@/services/user/questionService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Question } from "@/types/question";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import { useNavigate } from "react-router-dom";

const QuestionPage = () => {
  const { token } = useAuth();
  const { questionData } = useQuestions();
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [answers, setAnswers] = useState<{ [questionId: string]: string[] }>(
    {}
  );
  const [_feedback, setFeedback] = useState<{ [questionId: string]: boolean }>(
    {}
  ); //feedback,
  const [showFeedback, setShowFeedback] = useState(false);
  const [attemptButtonVisible, setAttemptButtonVisible] = useState(true);

  useEffect(() => {
    // Reset to first question and clear selections when questionData changes
    console.log("Question Data in useEffect:", questionData);
    if (!questionData) return;
    if (questionData && questionData.length > 0) {
      setCurrentQuestion(questionData[0]);
      setSelectedOptions([]);
      setSelectedOption("");
    }
  }, [questionData]);

  useEffect(() => {
    if (!currentQuestion) return;

    // Load saved answers if they exist
    const saved = answers[currentQuestion.id] || [];

    // Show feedback if the question was already attempted
    if (saved && saved.length > 0) {
      setShowFeedback(true);
      setAttemptButtonVisible(false);
    }

    if (currentQuestion.option_type === "multiple") {
      setSelectedOptions(saved);
      setSelectedOption("");
    } else {
      setSelectedOption(saved[0] || "");
      setSelectedOptions([]);
    }
  }, [currentQuestion, answers]);

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    if (!token) {
      console.error("No token available");
      return;
    }

    if (
      (currentQuestion.option_type === "multiple" &&
        selectedOptions.length === 0) ||
      (currentQuestion.option_type === "single" && selectedOption === "")
    ) {
      toast.error("Please select an option before proceeding.");
      return;
    }

    // Find the index of the current question
    const currentQuestionIndex = questionData.findIndex(
      (q: Question) => q.id === currentQuestion.id
    );

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= questionData.length) {
      toast.info("You've completed all questions!");
      navigate("/userpanel");
      return;
    }
    console.log("Next question index:", nextIndex);
    setCurrentQuestion(questionData[nextIndex]);
    setSelectedOptions([]);
    setSelectedOption("");
    setShowFeedback(false);
    setAttemptButtonVisible(true);
  };

  const handlePreviousQuestion = () => {
    if (!currentQuestion) return;
    const currentIndex = questionData.findIndex(
      (q: Question) => q.id === currentQuestion.id
    );
    const prevIndex =
      (currentIndex - 1 + questionData.length) % questionData.length;

    setCurrentQuestion(questionData[prevIndex]);
    setSelectedOptions([]);
    setShowFeedback(false);
    setSelectedOption("");
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

      // Save the answer and feedback
      setAnswers((prev) => ({ ...prev, [question.id]: selected }));
      setFeedback((prev) => ({ ...prev, [question.id]: result.isCorrect }));

      if (result.isCorrect) {
        toast.success("Correct answer!");
      } else {
        toast.error("Incorrect answer. Try again!");
      }

      setShowFeedback(true);
      setAttemptButtonVisible(false);
      console.log("Attempt Result:", result);
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

  const handleOptionSelect = (optionId: string) => {
    if (currentQuestion.option_type === "multiple") {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOption(optionId);
    }
  };
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Entrance Preparation Test
          </h1>
        </div>

        <Card className="mb-6 shadow-lg">
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
          </CardHeader>

          <CardContent>
            {showFeedback && (
              <div className="mb-6 p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Lightbulb size={18} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      Explanation
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                      {currentQuestion.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {currentQuestion.option_type === "multiple"
                ? currentQuestion.options.map((option) => (
                    <MultipleChoiceOption
                      key={option.label}
                      option={option}
                      handleOptionSelect={handleOptionSelect}
                      selectedOptions={selectedOptions}
                    />
                  ))
                : currentQuestion.options.map((option) => (
                    <SingleChoiceOption
                      key={option.label}
                      option={option}
                      handleOptionSelect={handleOptionSelect}
                      selectedOption={selectedOption}
                    />
                  ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            className="px-6 py-2 hover:bg-gray-100"
          >
            <ArrowLeft />
            <p>Previous</p>
          </Button>

          {attemptButtonVisible ? (
            <Button
              className="mt-6 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleAttemptQuestion(currentQuestion)}
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

        <div className="mt-8 text-center">
          <Button variant="destructive" size="lg" className="px-8 py-3">
            Submit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
