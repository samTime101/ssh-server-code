export type ReactionType = "like" | "dislike";

export interface Reaction {
  id: string;
  user_guid: string;
  question: string;
  reaction_type: ReactionType;
  created_at: string;
  updated_at: string;
}

export interface CreateReactionPayload {
  question: string;
  reaction_type: ReactionType;
}

export interface ReactionCheckResponse {
  question_id: string;
  reaction_type: ReactionType | null;
}

export interface ReactionCountResponse {
  question_id: string;
  likes: number;
  dislikes: number;
}
