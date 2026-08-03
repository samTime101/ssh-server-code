import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { CreateReactionPayload, Reaction, ReactionType } from "@/types/reaction";

const normalizeQuestionId = (question: string | { id?: string } | null | undefined): string => {
  if (!question) return "";
  if (typeof question === "string") return question;
  return question.id ?? "";
};

const normalizeReaction = (reaction: Reaction): Reaction => ({
  ...reaction,
  question: normalizeQuestionId(reaction.question),
});

export const createReaction = async (payload: CreateReactionPayload): Promise<Reaction> => {
  const response = await axiosInstance.post<Reaction>(API_ENDPOINTS.reactions, payload);
  return normalizeReaction(response.data);
};

export const updateReaction = async (
  reactionId: string,
  reactionType: ReactionType
): Promise<Reaction> => {
  const response = await axiosInstance.patch<Reaction>(`${API_ENDPOINTS.reactions}${reactionId}/`, {
    reaction_type: reactionType,
  });
  return normalizeReaction(response.data);
};

export const deleteReaction = async (reactionId: string): Promise<void> => {
  await axiosInstance.delete(`${API_ENDPOINTS.reactions}${reactionId}/`);
};
