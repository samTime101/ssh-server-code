import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuestions } from "@/hooks/useQuestions";
import { fetchQuestionSets, fetchQuestionSetSession } from "@/services/admin/questionset-service";
import { attemptQuestion, submitSubmission } from "@/services/user/question-service";
import type { Question, QuestionAttemptState } from "@/types/question";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import { getImageUrl } from "@/config/apiConfig";
import QuestionReview from "@/components/user/QuestionReview";
import Loader from "@/components/ui/Loader";
import ExamResultSummary from "@/components/user/ExamResultSummary";
import { useQuestionResponseTimer } from "@/hooks/user/useQuestionResponseTimer";
import { applyResumedSession, fetchResumedSession } from "@/utils/sessionResume";
import { getActiveMockTimer, markSubmissionNonContinuable } from "@/utils/sessionTimerStorage";

const MOCK_EXAM_DURATION_SECONDS = 3 * 60 * 60; // 3 hours

const MockExamPage = () => {
  const navigate = useNavigate();
  const {
    setSessionQuestions,
    questionData,
    currentSubmissionId,
    resetQuestionSelection,
    sessionAttempts,
    sessionInstanceId,
    setSessionAttempt,
    mockExamEndsAtMs,
    startMockExamTimer,
    restoreMockExamTimer,
    clearMockExamTimer,
  } = useQuestions();

  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [attempts, setAttempts] = useState<{ [id: string]: QuestionAttemptState }>({});
  const [timeLeft, setTimeLeft] = useState(() =>
    mockExamEndsAtMs
      ? Math.max(0, Math.round((mockExamEndsAtMs - Date.now()) / 1000))
      : MOCK_EXAM_DURATION_SECONDS
  );
  const [isExamFinished, setIsExamFinished] = useState(false);

  const sessionInitRef = useRef<number | null>(null);

  const handleFinishExam = useCallback(async () => {
    if (currentSubmissionId) {
      await submitSubmission(currentSubmissionId);
    }
    clearMockExamTimer();
    setIsExamFinished(true);
  }, [currentSubmissionId, clearMockExamTimer]);

  useEffect(() => {
    if (isLoading || isExamFinished || !mockExamEndsAtMs) return;

    const updateRemaining = () => {
      const remaining = Math.max(0, Math.round((mockExamEndsAtMs - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        toast.info("Time is up!");
        handleFinishExam();
      }
    };

    updateRemaining();
    const timer = setInterval(updateRemaining, 1000);
    return () => clearInterval(timer);
  }, [isLoading, isExamFinished, mockExamEndsAtMs, handleFinishExam]);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      setIsLoading(true);

      if (questionData?.length > 0 && currentSubmissionId) {
        if (!mockExamEndsAtMs) {
          startMockExamTimer(MOCK_EXAM_DURATION_SECONDS);
        }
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const mockTimer = getActiveMockTimer();
        if (mockTimer) {
          const resumed = await fetchResumedSession(mockTimer.submissionId);
          if (cancelled) return;
          if (resumed) {
            applyResumedSession(setSessionQuestions, resumed);
            restoreMockExamTimer(mockTimer.endsAtMs);
            if (!cancelled) setIsLoading(false);
            return;
          }
          clearMockExamTimer();
        }

        const { sets } = await fetchQuestionSets();
        if (!sets?.length) {
          toast.error("No exam sets available.");
          return;
        }

        const randomSet = sets[Math.floor(Math.random() * sets.length)];
        const session = await fetchQuestionSetSession(randomSet.id);
        const validQuestions = session.results ?? [];
        if (!validQuestions.length) {
          toast.error("The selected random set has no questions.");
          return;
        }

        const submissionId = session.submission_id ?? null;
        if (submissionId) markSubmissionNonContinuable(submissionId);
        setSessionQuestions(validQuestions, submissionId);
        startMockExamTimer(MOCK_EXAM_DURATION_SECONDS);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load mock exam.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion: Question | null =
    questionData && questionData.length > 0 ? questionData[currentIndex] || null : null;

  const { getResponseTimeSeconds, resetTimer } = useQuestionResponseTimer(currentQuestion?.id);

  useEffect(() => {
    if (sessionInitRef.current === sessionInstanceId) return;
    sessionInitRef.current = sessionInstanceId;

    if (!questionData || questionData.length === 0) {
      setCurrentIndex(0);
      setAttempts({});
      return;
    }

    const restoredAttempts: Record<string, QuestionAttemptState> = {};
    let resumeIndex = 0;
    questionData.forEach((question: Question, idx: number) => {
      const savedAttempt = sessionAttempts[question.id];
      if (savedAttempt) {
        restoredAttempts[question.id] = savedAttempt;
        resumeIndex = Math.max(resumeIndex, Math.min(idx + 1, questionData.length - 1));
      }
    });

    setAttempts(restoredAttempts);
    setCurrentIndex(resumeIndex);
  }, [questionData, sessionAttempts, sessionInstanceId]);

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

  const handleNextQuestion = async () => {
    if (!currentQuestion) return;

    if (
      (currentQuestion.option_type === "multiple" && selectedOptions.length === 0) ||
      (currentQuestion.option_type === "single" && selectedOption === "")
    ) {
      toast.error("Please select at least one option before proceeding.");
      return;
    }

    if (!attempts[currentQuestion.id]?.isAttempted) {
      await handleAttemptQuestion(currentQuestion);
    }

    const nextIndex = currentIndex + 1;
    if (!questionData || nextIndex >= questionData.length) {
      handleFinishExam();
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

    if (selected.length === 0) {
      toast.error("Please select at least one option.");
      return;
    }

    try {
      const result = await attemptQuestion(
        currentSubmissionId,
        question.id,
        selected,
        getResponseTimeSeconds()
      );

      resetTimer();

      const newAttempt: QuestionAttemptState = {
        selectedOptions: selected,
        selectedOption: question.option_type === "multiple" ? undefined : selected[0],
        isAttempted: true,
        feedback: result?.detail ?? "",
        correctOptions: result?.correct_answers ?? [],
        actualAnswers: result?.actual_answers ?? [],
        isCorrect: result?.is_correct ?? false,
      };

      setAttempts((prev) => ({
        ...prev,
        [question.id]: newAttempt,
      }));
      setSessionAttempt(question.id, newAttempt);
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
    if (currentSubmissionId) {
      markSubmissionNonContinuable(currentSubmissionId);
    }
    clearMockExamTimer();
    resetQuestionSelection();
    navigate("/userpanel");
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (isLoading) return <Loader />;

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

  if (isExamFinished) {
    let correctCount = 0;
    let attemptedCount = 0;

    questionData.forEach((q: Question) => {
      const attempt = attempts[q.id];
      if (attempt?.isAttempted) {
        attemptedCount++;
        if (attempt?.isCorrect) {
          correctCount++;
        }
      }
    });

    return (
      <div className="bg-background min-h-screen pt-12">
        <ExamResultSummary
          totalQuestions={totalQuestions}
          attemptedQuestionsCount={attemptedCount}
          correctCount={correctCount}
        />
        <div className="mt-8">
          <QuestionReview questions={questionData} attempts={attempts} onDone={handleExit} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4 md:p-8">
      <div className="flex w-full max-w-6xl flex-col gap-6 md:flex-row">
        <div className="w-full flex-shrink-0 md:sticky md:top-8 md:w-72 md:self-start">
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <h3 className="text-foreground font-semibold">Questions</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {questionData.map((q: Question, idx: number) => {
                  const isCurrent = currentIndex === idx;
                  const attempt = attempts[q.id];
                  const isAnswered = attempt?.isAttempted;
                  return (
                    <Button
                      key={q.id}
                      variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                      className={`h-10 w-10 shrink-0 rounded-full p-0 font-medium ${
                        isCurrent ? "ring-ring ring-2 ring-offset-2" : ""
                      }`}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      {idx + 1}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
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
              <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <progress
              value={currentIndex + 1}
              max={totalQuestions}
              className="[&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary h-3 w-full appearance-none overflow-hidden rounded-full"
            />
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              {currentQuestion.category_names && currentQuestion.category_names.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {currentQuestion.category_names.map((category, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary rounded-md px-3 py-1 text-sm font-medium"
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
                        disabled={false}
                        correctOptions={[]}
                      />
                    ))
                  : currentQuestion.options.map((option) => (
                      <SingleChoiceOption
                        key={option.label}
                        option={option}
                        handleOptionSelect={handleOptionSelect}
                        selectedOption={selectedOption}
                        disabled={false}
                        correctOptions={[]}
                      />
                    ))}
              </div>

              <div className="flex justify-end pt-6">
                <Button onClick={handleNextQuestion} className="bg-primary text-primary-foreground">
                  {currentIndex + 1 === totalQuestions ? "Finish Exam" : "Next Question"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MockExamPage;
