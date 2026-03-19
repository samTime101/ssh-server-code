import { Checkbox } from "@/components/ui/checkbox";

const MultipleChoiceOption = ({
  option,
  handleOptionSelect,
  selectedOptions,
  disabled = false,
  correctOptions,
}: {
  option: any;
  handleOptionSelect: (id: string) => void;
  selectedOptions: string[];
  disabled?: boolean;
  isCorrectAttempt?: boolean;
  correctOptions: string[];
}) => {
  const isSelected = selectedOptions.includes(option.label);
  const isCorrect = correctOptions.includes(option.label);

  // statusClass for "disabled/correct/incorrect" decorations
  let statusClass = "";
  if (disabled) {
    if (isCorrect) {
      statusClass = "border-green-500 bg-green-50";
    } else if (isSelected) {
      statusClass = "border-destructive/50 bg-destructive/10";
    } else {
      statusClass = "bg-muted";
    }
  }

  return (
    <div
      className={
        "border-border flex items-center space-x-3 rounded-lg border p-3 transition-all duration-200 " +
        (disabled
          ? ` cursor-not-allowed opacity-90 ${statusClass}`
          : " hover:bg-primary/5 hover:border-primary/30 cursor-pointer")
      }
    >
      <Checkbox
        id={`option-${option.label}`}
        className="h-5 w-5"
        checked={isSelected}
        disabled={disabled}
        onCheckedChange={() => !disabled && handleOptionSelect(option.label)}
      />
      <label
        htmlFor={`option-${option.label}`}
        className={
          "text-foreground flex-1 rounded-lg p-2 font-medium transition-all duration-200 " +
          (disabled ? "cursor-not-allowed" : "cursor-pointer")
        }
      >
        <span className="bg-muted mr-3 inline-block h-8 w-8 rounded-full text-center text-sm leading-8 font-bold">
          {option.label}
        </span>
        {option.text}
      </label>
    </div>
  );
};

export default MultipleChoiceOption;
