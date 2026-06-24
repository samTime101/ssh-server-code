import React, { useEffect, useState } from "react";
import { MessageSquare, Reply, Edit2, Trash2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from "@/hooks/useComments";
import type { CommentNode } from "@/types/comment";

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

interface CommentItemProps {
  comment: CommentNode;
  onReply: (parentId: string, text: string) => Promise<void>;
  onEdit: (commentId: string, text: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.text);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Maximum visual nesting depth to prevent layout breaking
  // const maxDepth = 5;
  // const paddingLeft = depth > maxDepth ? 0 : 24;

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyText);
      setReplyText("");
      setIsReplying(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editText.trim() || editText === comment.text) {
      setIsEditing(false);
      return;
    }
    setIsSubmitting(true);
    try {
      await onEdit(comment.id, editText);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`rounded-lg border p-4 transition-colors ${
          depth > 0
            ? "bg-muted/10 border-l-primary/40 border-l-[3px] shadow-sm ml-2"
            : "bg-card shadow-md"
        }`}
      >
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
              {(comment.user?.first_name?.[0] || comment.user?.username?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold">
                {comment.user?.first_name} {comment.user?.last_name}
                <span className="text-muted-foreground ml-2 text-xs font-normal">
                  @{comment.user?.username}
                </span>
              </p>
              <p className="text-muted-foreground text-xs">{timeAgo(comment.created_at)}</p>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="mt-3 space-y-2">
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Edit your comment..."
              className="min-h-[80px]"
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleEditSubmit} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-foreground mt-2 text-sm whitespace-pre-wrap">{comment.text}</p>
        )}

        {!isEditing && (
          <div className="mt-3 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary h-8 px-2"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="mr-1.5 h-4 w-4" />
              Reply
            </Button>

            {comment.is_owner && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary h-8 px-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="mr-1.5 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-8 px-2"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this comment?")) {
                      onDelete(comment.id);
                    }
                  }}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        )}

        {isReplying && (
          <div className="mt-4 flex w-full gap-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-[80px] resize-y"
              disabled={isSubmitting}
            />
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                onClick={handleReplySubmit}
                disabled={isSubmitting || !replyText.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsReplying(false)}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4" /> {/* Just an icon for cancel */}
              </Button>
            </div>
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-4 mt-4 relative pl-4 sm:pl-8 ml-2 sm:ml-4 border-l-2 border-border/50">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="relative">
              {/* Small horizontal line connecting the vertical line to the reply card */}
              <div className="absolute top-8 -left-4 sm:-left-8 w-4 sm:w-8 h-px bg-border/50" />
              <CommentItem
                comment={reply}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                depth={depth + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ThreadedComments: React.FC<{ questionId: string }> = ({ questionId }) => {
  const { comments, isLoading, fetchComments, addComment, editComment, removeComment } =
    useComments(questionId);

  const [topLevelText, setTopLevelText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (questionId) {
      fetchComments();
    }
  }, [questionId, fetchComments]);

  const handleTopLevelSubmit = async () => {
    if (!topLevelText.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment(topLevelText, null);
      setTopLevelText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2 border-b pb-2">
        <MessageSquare className="text-primary h-5 w-5" />
        <h3 className="text-xl font-semibold">Discussion</h3>
      </div>

      <div className="bg-muted/30 flex flex-col gap-3 rounded-lg border p-4">
        <Textarea
          value={topLevelText}
          onChange={(e) => setTopLevelText(e.target.value)}
          placeholder="Ask a question or start a discussion..."
          className="bg-background min-h-[100px]"
          disabled={isLoading || isSubmitting}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleTopLevelSubmit}
            disabled={!topLevelText.trim() || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Post Comment
              </>
            )}
          </Button>
        </div>
      </div>

      {isLoading && !comments.length ? (
        <div className="flex justify-center p-8">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-muted-foreground bg-muted/10 rounded-lg border border-dashed p-8 text-center">
              <MessageSquare className="mx-auto mb-3 h-8 w-8 opacity-20" />
              <p>No comments yet. Be the first to start the discussion!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={(parentId, text) => addComment(text, parentId)}
                onEdit={editComment}
                onDelete={removeComment}
                depth={0}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
