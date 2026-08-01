import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  createReaction,
  deleteReaction,
  updateReaction,
} from "@/services/user/reaction-service";
import type { ReactionType } from "@/types/reaction";

interface StoredUserReaction {
  id: string;
  type: ReactionType;
}

interface ReactionUiState {
  userReaction: ReactionType | null;
  userReactionId: string | null;
  isSubmitting: boolean;
}

const storageKey = (userGuid: string, questionId: string) =>
  `question-reaction:${userGuid}:${questionId}`;

const readStoredReaction = (userGuid: string, questionId: string): StoredUserReaction | null => {
  try {
    const raw = localStorage.getItem(storageKey(userGuid, questionId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredUserReaction;
    if (!parsed?.id || (parsed.type !== "like" && parsed.type !== "dislike")) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeStoredReaction = (
  userGuid: string,
  questionId: string,
  reaction: StoredUserReaction | null
) => {
  const key = storageKey(userGuid, questionId);
  if (!reaction) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify(reaction));
};

const getUserGuid = (user: { userId?: string; user_guid?: string } | null): string | null => {
  if (!user) return null;
  return user.user_guid || user.userId || null;
};

const initialState: ReactionUiState = {
  userReaction: null,
  userReactionId: null,
  isSubmitting: false,
};

export const useQuestionReaction = (questionId: string | undefined) => {
  const { user } = useAuth();
  const userGuid = getUserGuid(user as { userId?: string; user_guid?: string } | null);
  const [state, setState] = useState<ReactionUiState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!questionId || !userGuid) {
      setState(initialState);
      return;
    }

    const stored = readStoredReaction(userGuid, questionId);
    setState({
      userReaction: stored?.type ?? null,
      userReactionId: stored?.id ?? null,
      isSubmitting: false,
    });
  }, [questionId, userGuid]);

  const react = useCallback(
    async (nextType: ReactionType) => {
      if (!questionId || !userGuid) {
        toast.error("Please sign in to react to questions.");
        return;
      }

      const prev = stateRef.current;
      if (prev.isSubmitting) return;

      const isRemoving = prev.userReaction === nextType;
      const isSwitching = !!prev.userReaction && prev.userReaction !== nextType;

      setState({
        ...prev,
        userReaction: isRemoving ? null : nextType,
        isSubmitting: true,
      });

      try {
        if (isRemoving && prev.userReactionId) {
          await deleteReaction(prev.userReactionId);
          writeStoredReaction(userGuid, questionId, null);
          setState({
            userReaction: null,
            userReactionId: null,
            isSubmitting: false,
          });
          return;
        }

        if (isSwitching && prev.userReactionId) {
          const updated = await updateReaction(prev.userReactionId, nextType);
          writeStoredReaction(userGuid, questionId, {
            id: updated.id,
            type: updated.reaction_type,
          });
          setState({
            userReaction: updated.reaction_type,
            userReactionId: updated.id,
            isSubmitting: false,
          });
          return;
        }

        const created = await createReaction({
          question: questionId,
          reaction_type: nextType,
        });
        writeStoredReaction(userGuid, questionId, {
          id: created.id,
          type: created.reaction_type,
        });
        setState({
          userReaction: created.reaction_type,
          userReactionId: created.id,
          isSubmitting: false,
        });
      } catch (error: unknown) {
        console.error("Error updating reaction:", error);
        setState({ ...prev, isSubmitting: false });

        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 403) {
          toast.error("Reactions are not available for your account yet.");
        } else if (status === 401) {
          toast.error("Please sign in to react to questions.");
        } else {
          toast.error("Could not save your reaction. Please try again.");
        }
      }
    },
    [questionId, userGuid]
  );

  return {
    userReaction: state.userReaction,
    isSubmitting: state.isSubmitting,
    react,
  };
};
