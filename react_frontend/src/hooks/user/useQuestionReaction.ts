import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  createReaction,
  getReactionCheck,
  getReactionCount,
} from "@/services/user/reaction-service";
import type { ReactionType } from "@/types/reaction";

interface ReactionUiState {
  userReaction: ReactionType | null;
  likes: number;
  dislikes: number;
  isLoading: boolean;
  isSubmitting: boolean;
}

const initialState: ReactionUiState = {
  userReaction: null,
  likes: 0,
  dislikes: 0,
  isLoading: false,
  isSubmitting: false,
};

const nextCounts = (
  likes: number,
  dislikes: number,
  prev: ReactionType | null,
  next: ReactionType
): { likes: number; dislikes: number } => {
  let nextLikes = likes;
  let nextDislikes = dislikes;

  if (prev === "like") nextLikes = Math.max(0, nextLikes - 1);
  if (prev === "dislike") nextDislikes = Math.max(0, nextDislikes - 1);
  if (next === "like") nextLikes += 1;
  if (next === "dislike") nextDislikes += 1;

  return { likes: nextLikes, dislikes: nextDislikes };
};

export const useQuestionReaction = (questionId: string | undefined) => {
  const { user } = useAuth();
  const [state, setState] = useState<ReactionUiState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!questionId || !user) {
      setState(initialState);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const [check, count] = await Promise.all([
          getReactionCheck(questionId),
          getReactionCount(questionId),
        ]);

        if (cancelled) return;

        setState({
          userReaction: check.reaction_type,
          likes: count.likes,
          dislikes: count.dislikes,
          isLoading: false,
          isSubmitting: false,
        });
      } catch (error) {
        console.error("Error loading reactions:", error);
        if (cancelled) return;
        setState(initialState);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [questionId, user]);

  const react = useCallback(
    async (nextType: ReactionType) => {
      if (!questionId || !user) {
        toast.error("Please sign in to react to questions.");
        return;
      }

      const prev = stateRef.current;
      if (prev.isSubmitting || prev.isLoading) return;

      // Backend upserts via POST; non-admins cannot delete a reaction.
      if (prev.userReaction === nextType) return;

      const counts = nextCounts(prev.likes, prev.dislikes, prev.userReaction, nextType);

      setState({
        ...prev,
        userReaction: nextType,
        likes: counts.likes,
        dislikes: counts.dislikes,
        isSubmitting: true,
      });

      try {
        const saved = await createReaction({
          question: questionId,
          reaction_type: nextType,
        });

        const refreshed = await getReactionCount(questionId);

        setState({
          userReaction: saved.reaction_type,
          likes: refreshed.likes,
          dislikes: refreshed.dislikes,
          isLoading: false,
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
    [questionId, user]
  );

  return {
    userReaction: state.userReaction,
    likes: state.likes,
    dislikes: state.dislikes,
    isLoading: state.isLoading,
    isSubmitting: state.isSubmitting,
    react,
  };
};
