import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuestionReaction } from "@/hooks/user/useQuestionReaction";
import { cn } from "@/lib/utils";

interface QuestionReactionButtonsProps {
  questionId: string;
  className?: string;
}

const QuestionReactionButtons = ({ questionId, className }: QuestionReactionButtonsProps) => {
  const { userReaction, isSubmitting, react } = useQuestionReaction(questionId);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isSubmitting}
        onClick={() => void react("like")}
        aria-pressed={userReaction === "like"}
        aria-label="Like question"
        className={cn(
          "h-9 px-3",
          userReaction === "like" &&
            "border-emerald-500/40 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
        )}
      >
        <ThumbsUp className={cn("h-4 w-4", userReaction === "like" && "fill-current")} />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isSubmitting}
        onClick={() => void react("dislike")}
        aria-pressed={userReaction === "dislike"}
        aria-label="Dislike question"
        className={cn(
          "h-9 px-3",
          userReaction === "dislike" &&
            "border-rose-500/40 bg-rose-50 text-rose-700 hover:bg-rose-50 hover:text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
        )}
      >
        <ThumbsDown className={cn("h-4 w-4", userReaction === "dislike" && "fill-current")} />
      </Button>
    </div>
  );
};

export default QuestionReactionButtons;
