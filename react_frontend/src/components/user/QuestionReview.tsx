import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import type { Question, QuestionAttemptState } from "@/types/question";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";
import EditorRenderer from "@/components/EditorRenderer";
import { getImageUrl } from "@/config/apiConfig";

type QuestionReviewProps = {
  questions: Question[];
  attempts: Record<string, QuestionAttemptState>;
  onDone: () => void;
};

const QuestionReview = ({ questions, attempts, onDone }: QuestionReviewProps) => {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-foreground text-3xl font-bold">Session Review</h1>
          <span className="bg-muted text-foreground rounded-md px-3 py-1 text-sm font-semibold">
            {questions.length} Attempted
          </span>
        </div>

        {questions.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No attempted questions found for this session.
              </p>
            </CardContent>
          </Card>
        )}

        {questions.map((question, index) => {
          const attempt = attempts[question.id];
          const selectedForSingle = attempt?.selectedOption ?? "";
          const selectedForMultiple = attempt?.selectedOptions ?? [];
          const correctOptions = attempt?.correctOptions ?? [];

          return (
            <Card key={question.id} className="shadow-lg">
              <CardHeader className="space-y-3 pb-4">
                <div className="text-muted-foreground text-sm font-medium">
                  Question {index + 1}
                </div>
                <h2 className="text-foreground text-xl leading-relaxed font-semibold">
                  {question.question_text}
                </h2>
                {question.question_image_url && (
                  <div className="flex justify-center">
                    <img
                      src={getImageUrl(question.question_image_url)}
                      alt="Question illustration"
                      className="max-h-72 w-auto max-w-full rounded-lg border object-contain shadow-md"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {question.option_type === "multiple"
                    ? question.options.map((option) => (
                        <MultipleChoiceOption
                          key={option.label}
                          option={option}
                          handleOptionSelect={() => {}}
                          selectedOptions={selectedForMultiple}
                          disabled
                          correctOptions={correctOptions}
                        />
                      ))
                    : question.options.map((option) => (
                        <SingleChoiceOption
                          key={option.label}
                          option={option}
                          handleOptionSelect={() => {}}
                          selectedOption={selectedForSingle}
                          disabled
                          correctOptions={correctOptions}
                          radioName={`review-${question.id}`}
                        />
                      ))}
                </div>

                <div className="border-primary bg-primary/5 rounded-lg border-l-4 p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
                        <Lightbulb size={18} className="text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-primary flex items-center text-sm font-semibold">
                        Explanation
                      </h3>
                      <EditorRenderer data={question.description} className="text-foreground" />
                      {question.description_image_url && (
                        <div className="flex justify-center">
                          <img
                            src={getImageUrl(question.description_image_url)}
                            alt="Question explanation"
                            className="max-h-72 w-auto max-w-full rounded-lg object-contain shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <div className="text-center">
          <Button size="lg" className="px-8 py-3" onClick={onDone}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionReview;
