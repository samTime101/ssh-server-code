import React, { useState } from "react";
import { MessageSquare, Send, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitQuestionFeedback } from "@/services/user/question-service";

interface QuestionFeedbackWidgetProps {
  questionId: string;
}

const QuestionFeedbackWidget: React.FC<QuestionFeedbackWidgetProps> = ({ questionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = feedbackText.trim();
    if (!trimmed) {
      toast.error("Feedback cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitQuestionFeedback(questionId, trimmed);
      setIsSuccess(true);
      setFeedbackText("");
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 2000);
    } catch (error: any) {
      const errMsg = error.response?.data?.feedback?.[0] || "Failed to submit feedback.";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Vertical tab anchored flush to the right side of the question card */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          fontSize: "12px",
          lineHeight: 1,
          letterSpacing: "0.08em",
        }}
        className="absolute right-0 top-[55%] translate-x-full flex items-center gap-0.5 px-[3px] py-1 bg-white/95 hover:bg-slate-50 border border-l-0 border-slate-200 shadow-sm rounded-r text-slate-400 hover:text-slate-500 font-medium uppercase cursor-pointer transition-colors select-none z-10"
      >
        <MessageSquare className="h-1.5 w-1.5 shrink-0 rotate-[90deg]" style={{ writingMode: "horizontal-tb" }} />
        <span>Feedback</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-6">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader className="text-left">
                <DialogTitle className="text-xl font-bold text-foreground">
                  Question feedback
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm mt-1">
                  Share your thoughts on this question.
                </DialogDescription>
              </DialogHeader>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder=""
                rows={4}
                className="w-full rounded-lg border border-border bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/45 focus:border-primary transition-all resize-none"
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                disabled={isSubmitting || !feedbackText.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="bg-green-100 dark:bg-green-900/30 flex h-14 w-14 items-center justify-center rounded-full text-green-600 dark:text-green-400">
                <Check className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-foreground text-lg font-bold">
                  Thanks for your feedback!
                </h3>
                <p className="text-muted-foreground text-sm">
                  We appreciate you helping us improve.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionFeedbackWidget;
