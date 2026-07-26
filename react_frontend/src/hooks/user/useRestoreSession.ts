import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuestions } from "@/hooks/useQuestions";
import { getSubmissionHistory } from "@/services/user/history-service";
import { SUBMISSION_PAGE_SIZE } from "@/utils/historyUtils";
import {
  applyResumedSession,
  fetchResumedSession,
  findLatestActive,
  type SessionKind,
} from "@/utils/sessionResume";
import { getActiveExamTimer } from "@/utils/sessionTimerStorage";

interface UseRestoreSessionOptions {
  kind: SessionKind;
  fallbackPath: string;
  /** Question-bank only: restore timed exam from timer storage first. */
  supportExamTimer?: boolean;
}

/** Refresh restore for QB / CEE question pages. */
export const useRestoreSession = ({
  kind,
  fallbackPath,
  supportExamTimer = false,
}: UseRestoreSessionOptions) => {
  const navigate = useNavigate();
  const {
    questionData,
    currentSubmissionId,
    setSessionQuestions,
    setIsExamModeEnabled,
    clearSessionTimer,
    restoreSessionTimer,
  } = useQuestions();

  const [isRestoringSession, setIsRestoringSession] = useState(() => !questionData?.length);

  useEffect(() => {
    if (questionData?.length > 0 && currentSubmissionId) {
      setIsRestoringSession(false);
      return;
    }

    let cancelled = false;

    const restore = async () => {
      setIsRestoringSession(true);
      try {
        if (supportExamTimer) {
          const examTimer = getActiveExamTimer();
          if (examTimer) {
            const resumed = await fetchResumedSession(examTimer.submissionId);
            if (cancelled) return;
            if (!resumed) {
              clearSessionTimer();
              navigate(fallbackPath, { replace: true });
              return;
            }
            setIsExamModeEnabled?.(true);
            applyResumedSession(setSessionQuestions, resumed);
            restoreSessionTimer?.(examTimer.endsAtMs);
            return;
          }
        }

        const submissions = await getSubmissionHistory(
          kind === "question_bank" ? kind : undefined,
          { pageSize: SUBMISSION_PAGE_SIZE, maxPages: 5 }
        );
        if (cancelled) return;

        const active = findLatestActive(submissions, kind);
        if (!active) {
          navigate(fallbackPath, { replace: true });
          return;
        }

        const resumed = await fetchResumedSession(active.submission_id);
        if (cancelled) return;
        if (!resumed) {
          navigate(fallbackPath, { replace: true });
          return;
        }

        if (supportExamTimer) {
          setIsExamModeEnabled?.(false);
          clearSessionTimer?.();
        }
        applyResumedSession(setSessionQuestions, resumed);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to restore session:", error);
        navigate(fallbackPath, { replace: true });
      } finally {
        if (!cancelled) setIsRestoringSession(false);
      }
    };

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  return { isRestoringSession };
};
