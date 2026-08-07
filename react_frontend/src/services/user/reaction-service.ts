import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type {
  CreateReactionPayload,
  Reaction,
  ReactionCheckResponse,
  ReactionCountResponse,
} from "@/types/reaction";

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

export const getReactionCheck = async (questionId: string): Promise<ReactionCheckResponse> => {
  const response = await axiosInstance.get<ReactionCheckResponse>(
    API_ENDPOINTS.reactionCheck(questionId)
  );
  return response.data;
};

export const getReactionCount = async (questionId: string): Promise<ReactionCountResponse> => {
  const response = await axiosInstance.get<ReactionCountResponse>(
    API_ENDPOINTS.reactionCount(questionId)
  );
  return response.data;
};
