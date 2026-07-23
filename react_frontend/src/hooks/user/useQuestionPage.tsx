import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuestions } from "@/hooks/useQuestions";
import { attemptQuestion, submitSubmission } from "@/services/user/question-service";
import type { Question, QuestionAttemptState } from "@/types/question";
import { getEffectiveQuestionCount } from "@/utils/examModeUtils";
import { bookmarkQuestion, removeBookmark } from "@/services/user/bookmark-service";
import { useQuestionResponseTimer } from "@/hooks/user/useQuestionResponseTimer";
import { useRestoreSession } from "@/hooks/user/useRestoreSession";
import { markSubmissionNonContinuable } from "@/utils/sessionTimerStorage";

export const useQuestionPageController = () => {
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
    currentSubmissionId,
    updateQuestionBookmark,
    sessionAttempts,
    sessionInstanceId,
    setSessionAttemptCount,
    setSessionAttemptResults,
    setSessionAttempt,
  } = useQuestions();
  const navigate = useNavigate();
  const { isRestoringSession } = useRestoreSession({
    kind: "question_bank",
    fallbackPath: "/userpanel/question-bank",
    supportExamTimer: true,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, QuestionAttemptState>>({});

  const prevDataLengthRef = useRef(0);
  const prevQuestionIdsRef = useRef<string[]>([]);
  const timeoutHandledRef = useRef(false);
  const sessionInitRef = useRef<number | null>(null);

  const currentQuestion: Question | null =
    questionData && questionData.length > 0 ? questionData[currentIndex] || null : null;

  const { getResponseTimeSeconds, resetTimer } = useQuestionResponseTimer(currentQuestion?.id);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (currentQuestion) setIsBookmarked(!!currentQuestion.is_bookmarked);
  }, [currentQuestion]);

  const handleBookmarkToggle = async () => {
    if (!currentQuestion) return;
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    try {
      if (previousState) {
        await removeBookmark(currentQuestion.id);
        toast.success("Bookmark removed");
      } else {
        await bookmarkQuestion(currentQuestion.id);
        toast.success("Question bookmarked");
      }
      updateQuestionBookmark(currentQuestion.id, !previousState);
    } catch {
      setIsBookmarked(previousState);
      toast.error("Failed to update bookmark");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const prevLength = prevDataLengthRef.current;
    prevDataLengthRef.current = questionData?.length ?? 0;

    const currentIds = (questionData as Question[] | undefined)?.map((q) => q.id) ?? [];
    const prevIds = prevQuestionIdsRef.current;
    const isSameList =
      currentIds.length === prevIds.length && currentIds.every((id, idx) => id === prevIds[idx]);
    const isAppend =
      prevIds.length > 0 &&
      currentIds.length > prevIds.length &&
      prevIds.every((id, idx) => id === currentIds[idx]);
    prevQuestionIdsRef.current = currentIds;

    if (!questionData?.length) {
      setCurrentIndex(0);
      return;
    }
    if (questionData.length > prevLength || isSameList || isAppend) return;

    setCurrentIndex(0);
    setSelectedOptions([]);
    setSelectedOption("");
  }, [questionData]);

  useEffect(() => {
    if (sessionInitRef.current === sessionInstanceId) return;
    sessionInitRef.current = sessionInstanceId;

    setAttempts({});
    setCurrentIndex(0);
    setSelectedOptions([]);
    setSelectedOption("");
    setShowReview(false);

    if (!questionData?.length) return;

    const initialAttempts: Record<string, QuestionAttemptState> = {};
    let resumeIndex = 0;
    const maxIndex = questionData.length - 1;

    questionData.forEach((question: Question, idx: number) => {
      const saved = sessionAttempts[question.id];
      if (!saved) return;
      initialAttempts[question.id] = saved;
      resumeIndex = Math.min(idx + 1, maxIndex);
    });

    setAttempts(initialAttempts);
    setCurrentIndex(resumeIndex);
  }, [questionData, sessionAttempts, sessionInstanceId]);

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
      if (currentSubmissionId) markSubmissionNonContinuable(currentSubmissionId);
      clearSessionTimer();
      resetQuestionSelection();
      toast.error("Time is up. Session ended.");
      navigate("/userpanel");
    };

    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(intervalId);
  }, [clearSessionTimer, currentSubmissionId, navigate, resetQuestionSelection, sessionEndsAtMs]);

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
  }, [attempts, currentQuestion]);

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

  const handleBack = () => {
    if (isExamModeEnabled && currentSubmissionId) {
      markSubmissionNonContinuable(currentSubmissionId);
    }
    clearSessionTimer();
    resetQuestionSelection();
    navigate("/userpanel");
  };

  const handleReviewDone = () => {
    clearSessionTimer();
    resetQuestionSelection();
    navigate("/userpanel");
  };

  const totalAvailable = questionPagination?.count ?? questionData.length;
  const totalCount = isExamModeEnabled
    ? getEffectiveQuestionCount(sessionQuestionLimit, totalAvailable)
    : totalAvailable;

  const currentAttempt = currentQuestion ? attempts[currentQuestion.id] : undefined;
  const isAttempted = !!currentAttempt?.isAttempted;

  const reviewQuestions = (questionData as Question[])
    .slice(0, totalCount)
    .filter((question) => Boolean(attempts[question.id]?.isAttempted));

  const recordSessionAttempt = (questionId: string, attempt: QuestionAttemptState) => {
    if (attempts[questionId]?.isAttempted) return;
    setSessionAttemptCount((prev: number) => prev + 1);
    setSessionAttemptResults((prev: (boolean | null)[]) => [...prev, attempt.isCorrect ?? null]);
    setSessionAttempt(questionId, attempt);
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

    if (!selected.length) {
      toast.error("Please select an option before attempting the question.");
      return;
    }

    try {
      setIsSavingAnswer(true);
      const result = await attemptQuestion(
        currentSubmissionId,
        question.id,
        selected,
        getResponseTimeSeconds()
      );
      if (!result) {
        toast.error("Something wrong occurred. Try again.");
        return;
      }

      resetTimer();
      const newAttempt: QuestionAttemptState = {
        selectedOptions: selected,
        selectedOption: question.option_type === "multiple" ? undefined : selected[0],
        isAttempted: true,
        feedback: result?.detail ?? "",
        correctOptions: result?.correct_answers ?? [],
        actualAnswers: result?.actual_answers ?? [],
        isCorrect: result.is_correct,
      };
      setAttempts((prev) => ({ ...prev, [question.id]: newAttempt }));
      recordSessionAttempt(question.id, newAttempt);
      toast[result.is_correct ? "success" : "error"](
        result.is_correct ? "Correct answer!" : "Incorrect answer. Try again!"
      );
    } catch (error) {
      console.error("Error attempting question:", error);
      toast.error("Failed to save answer. Please try again.");
    } finally {
      setIsSavingAnswer(false);
    }
  };

  const handleExamNextQuestion = async () => {
    if (!currentQuestion) return;
    if (!currentSubmissionId) {
      toast.error("No active submission found. Please start a new session.");
      return;
    }
    if (
      (currentQuestion.option_type === "multiple" && selectedOptions.length === 0) ||
      (currentQuestion.option_type === "single" && selectedOption === "")
    ) {
      toast.error("Please select an option before proceeding.");
      return;
    }

    const selected =
      currentQuestion.option_type === "multiple"
        ? selectedOptions
        : selectedOption
          ? [selectedOption]
          : [];

    try {
      setIsSavingAnswer(true);
      const result = await attemptQuestion(
        currentSubmissionId,
        currentQuestion.id,
        selected,
        getResponseTimeSeconds()
      );
      if (!result) {
        toast.error("Failed to save answer. Please try again.");
        return;
      }

      resetTimer();
      const newAttempt: QuestionAttemptState = {
        selectedOptions: selected,
        selectedOption: currentQuestion.option_type === "multiple" ? undefined : selected[0],
        isAttempted: true,
        feedback: result?.detail ?? "",
        correctOptions: result?.correct_answers ?? [],
        actualAnswers: result?.actual_answers ?? [],
        isCorrect: result.is_correct,
      };
      setAttempts((prev) => ({ ...prev, [currentQuestion.id]: newAttempt }));
      recordSessionAttempt(currentQuestion.id, newAttempt);
    } catch (error) {
      console.error("Error attempting question:", error);
      toast.error("Failed to save answer. Please try again.");
      return;
    } finally {
      setIsSavingAnswer(false);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalCount) {
      try {
        setIsSubmittingSession(true);
        const submissionResponse = await submitSubmission(currentSubmissionId);
        if (!submissionResponse) {
          toast.error("Failed to submit session. Please try again.");
          return;
        }
        setShowReview(true);
        toast.success("Session submitted. Review your answers below.");
      } catch (error) {
        console.error("Error submitting session:", error);
        toast.error("Failed to submit session. Please try again.");
      } finally {
        setIsSubmittingSession(false);
      }
      return;
    }

    if (!questionData || nextIndex >= questionData.length) {
      if (questionPagination?.next && questionData.length < totalCount) {
        await fetchNextPage();
        setCurrentIndex(nextIndex);
      } else {
        toast.error("Unable to load the next question.");
      }
      return;
    }

    setCurrentIndex(nextIndex);
  };

  const handleNormalNextQuestion = async () => {
    if (!currentQuestion) return;
    if (!attempts[currentQuestion.id]?.isAttempted) {
      toast.error("Please attempt the current question before proceeding.");
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= totalCount) {
      await finalizeAndExitSession();
      return;
    }

    if (!questionData || nextIndex >= questionData.length) {
      if (questionPagination?.next && questionData.length < totalCount) {
        await fetchNextPage();
        setCurrentIndex(nextIndex);
      } else {
        await finalizeAndExitSession();
      }
      return;
    }

    setCurrentIndex(nextIndex);
  };

  const handleNextQuestion = async () => {
    if (isExamModeEnabled) {
      await handleExamNextQuestion();
      return;
    }
    await handleNormalNextQuestion();
  };

  const finalizeAndExitSession = async () => {
    if (currentSubmissionId) {
      try {
        setIsSubmittingSession(true);
        const result = await submitSubmission(currentSubmissionId);
        if (!result) {
          toast.error("Failed to submit session. Please try again.");
          return;
        }
      } catch (error) {
        console.error("Error submitting session:", error);
        toast.error("Failed to submit session. Please try again.");
        return;
      } finally {
        setIsSubmittingSession(false);
      }
    }
    toast.success("Session completed!");
    clearSessionTimer();
    resetQuestionSelection();
    navigate("/userpanel/question-bank");
  };

  const isLastQuestion = currentIndex + 1 >= totalCount;

  return {
    currentQuestion,
    questionData,
    currentIndex,
    totalCount,
    isLastQuestion,
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
    isRestoringSession,
    handleOptionSelect,
    handleBack,
    handleReviewDone,
    handleAttemptQuestion,
    handlePreviousQuestion: () => {
      if (!questionData?.length || currentIndex === 0) return;
      setCurrentIndex(currentIndex - 1);
    },
    handleNextQuestion,
    handleFinishSession: finalizeAndExitSession,
    handleBookmarkToggle,
    isBookmarked,
  };
};
