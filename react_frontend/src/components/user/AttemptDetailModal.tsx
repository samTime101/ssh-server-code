import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Attempt } from "@/types/history";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MultipleChoiceOption from "@/components/user/MultipleChoiceOption";
import SingleChoiceOption from "@/components/user/SingleChoiceOption";

type AttemptDetailModalProps = {
  attempt: Attempt | null;
  isOpen: boolean;
  onClose: () => void;
};

const AttemptDetailModal = ({ attempt, isOpen, onClose }: AttemptDetailModalProps) => {
  if (!attempt) return null;

  const isMultipleChoice = (attempt.selected_answers?.length ?? 0) > 1;

  const options = (attempt.selected_answers ?? []).map((answerLabel, index) => ({
    label: answerLabel,
    text: attempt.selected_options_labels?.[index] ?? "",
    is_true: attempt.is_correct,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card max-h-[90vh] w-[96vw] overflow-y-auto sm:max-w-[96vw] lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Question Attempt</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
            
          {/* Question Card */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <h2 className="text-foreground text-xl leading-relaxed font-semibold">
                {attempt.question_text}
              </h2>
            </CardHeader>

            {/* Options */}
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {isMultipleChoice
                  ? options.map((option) => (
                      <MultipleChoiceOption
                        key={option.label}
                        option={option}
                        handleOptionSelect={() => {}}
                        selectedOptions={attempt.selected_answers ?? []}
                        disabled={true}
                        correctOptions={attempt.is_correct ? (attempt.selected_answers ?? []) : []}
                        showResultStyles={true}
                      />
                    ))
                  : options.map((option) => (
                      <SingleChoiceOption
                        key={option.label}
                        option={option}
                        handleOptionSelect={() => {}}
                        selectedOption={attempt.selected_answers?.[0] ?? ""}
                        disabled={true}
                        correctOptions={attempt.is_correct ? (attempt.selected_answers ?? []) : []}
                        radioName="attempt-view"
                        showResultStyles={true}
                      />
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttemptDetailModal;
