import { useCallback, useEffect, useRef } from "react";

/**
 * Tracks how long the current question has been visible.
 * Call getResponseTimeSeconds() when submitting an attempt.
 */
export const useQuestionResponseTimer = (questionId: string | null | undefined) => {
  const shownAtMsRef = useRef(Date.now());

  useEffect(() => {
    if (questionId) {
      shownAtMsRef.current = Date.now();
    }
  }, [questionId]);

  const getResponseTimeSeconds = useCallback(() => {
    return Math.max(0, Math.floor((Date.now() - shownAtMsRef.current) / 1000));
  }, []);

  const resetTimer = useCallback(() => {
    shownAtMsRef.current = Date.now();
  }, []);

  return { getResponseTimeSeconds, resetTimer };
};
