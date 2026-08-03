import type { Question, QuestionAttemptState } from "@/types/question";
import { getProgressClasses, getQuestionProgressStatus } from "@/utils/questionProgressUtils";
import { cn } from "@/lib/utils";
import { useScrollOverflow } from "@/hooks/useScrollOverflow";
import { ScrollIndicators } from "@/components/ui/scroll-indicators";

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
}: QuestionProgressProps) => {
  const [scrollRef, { canScrollUp, canScrollDown }] = useScrollOverflow();

  return (
    <div className="bg-card flex max-h-[18rem] flex-col rounded-lg border p-4 shadow-sm lg:max-h-[calc(100vh-12rem)]">
      <p className="mb-3 text-sm font-semibold">Session Progress</p>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="scrollbar-hidden grid max-h-full grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-2 overflow-y-auto pr-1 lg:grid-cols-5"
        >
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
        <ScrollIndicators canScrollUp={canScrollUp} canScrollDown={canScrollDown} />
      </div>
    </div>
  );
};

export default QuestionProgress;
