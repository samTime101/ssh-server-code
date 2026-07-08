import type { Question, QuestionAttemptState } from "@/types/question";
import { getProgressClasses, getQuestionProgressStatus } from "@/utils/questionProgressUtils";
import { cn } from "@/lib/utils";

interface QuestionProgressProps {
  totalCount: number;
  currentIndex: number;
  questionData?: Question[];
  attempts: Record<string, QuestionAttemptState>;
}

const QuestionProgress = ({
  totalCount,
  currentIndex,
  questionData,
  attempts,
}: QuestionProgressProps) => (
  <div className="bg-card rounded-lg border p-4 shadow-sm">
    <p className="mb-3 text-sm font-semibold">Session Progress</p>

    <div className="grid max-h-[600px] grid-cols-5 gap-2 overflow-y-auto pr-1">
      {Array.from({ length: totalCount }).map((_, index) => {
        const status = getQuestionProgressStatus(questionData, attempts, index);
        const bubbleClasses = getProgressClasses(status);
        const isCurrent = index === currentIndex;

        return (
          <div
            key={`progress-${index}`}
            className={cn(
              "flex aspect-square items-center justify-center rounded-lg border text-xs font-semibold transition-colors",
              isCurrent ? "bg-primary border-primary text-primary-foreground" : bubbleClasses
            )}
          >
            {index + 1}
          </div>
        );
      })}
    </div>
  </div>
);

export default QuestionProgress;
