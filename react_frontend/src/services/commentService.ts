import axiosInstance from "@/services/axios";
import type { CommentNode, CreateCommentPayload } from "@/types/comment";

export const getCommentTree = async (questionId: string): Promise<CommentNode[]> => {
  const response = await axiosInstance.get(`/comments/tree/?question_id=${questionId}`);
  return response.data;
};

export const createComment = async (payload: CreateCommentPayload): Promise<any> => {
  const response = await axiosInstance.post(`/comments/`, payload);
  return response.data;
};

export const updateComment = async (commentId: string, text: string): Promise<any> => {
  const response = await axiosInstance.patch(`/comments/${commentId}/`, { text });
  return response.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await axiosInstance.delete(`/comments/${commentId}/`);
};