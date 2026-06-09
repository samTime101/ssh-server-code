import { useState, useCallback } from "react";
import {
  getCommentTree,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "@/services/commentService";
import type { CommentNode, CreateCommentPayload } from "@/types/comment";
import { toast } from "sonner";

export const useComments = (questionId: string) => {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!questionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCommentTree(questionId);
      setComments(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load comments");
      toast.error("Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  }, [questionId]);

  const addComment = async (text: string, parentCommentId: string | null = null) => {
    try {
      const payload: CreateCommentPayload = {
        question: questionId,
        text,
        parent_comment: parentCommentId,
      };
      await createCommentApi(payload);
      toast.success("Comment added successfully");
      await fetchComments(); // Refetch tree to ensure consistency
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to add comment");
      throw err;
    }
  };

  const editComment = async (commentId: string, newText: string) => {
    try {
      await updateCommentApi(commentId, newText);
      toast.success("Comment updated successfully");
      await fetchComments();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to edit comment");
      throw err;
    }
  };

  const removeComment = async (commentId: string) => {
    try {
      await deleteCommentApi(commentId);
      toast.success("Comment deleted successfully");
      await fetchComments();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to delete comment");
      throw err;
    }
  };

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    editComment,
    removeComment,
  };
};