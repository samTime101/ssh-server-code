import type { Question, QuestionAttemptState } from "@/types/question";
import { getProgressClasses, getQuestionProgressStatus } from "@/utils/questionProgressUtils";

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
    <div className="mb-3 flex items-center justify-between gap-2">
      <p className="text-sm font-semibold">Session Progress</p>
    </div>

    <div className="overflow-x-auto overflow-y-visible px-1 py-2">
      <div className="flex min-w-max items-center pr-1">
        {Array.from({ length: totalCount }).map((_, index) => {
          const status = getQuestionProgressStatus(questionData, attempts, index);
          const { bubbleClasses, lineClasses } = getProgressClasses(status);
          const isCurrent = index === currentIndex;

          return (
            <div key={`progress-${index}`} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${bubbleClasses} ${
                  isCurrent ? "ring-primary ring-offset-background ring-2 ring-offset-1" : ""
                }`}
              >
                {index + 1}
              </div>

              {index < totalCount - 1 && <div className={`h-0.5 w-7 ${lineClasses}`} />}
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default QuestionProgress;
