const SingleChoiceOption = ({
  option,
  handleOptionSelect,
  selectedOption,
  disabled = false,
  correctOptions,
  radioName = "single-choice",
  showResultStyles = true,
}: {
  option: any;
  handleOptionSelect: (id: string) => void;
  selectedOption: string;
  disabled?: boolean;
  isCorrectAttempt?: boolean;
  correctOptions: string[];
  radioName?: string;
  showResultStyles?: boolean;
}) => {
  const isSelected = selectedOption === option.label;
  const isCorrect = correctOptions.includes(option.label);
  const isChecked = disabled ? isSelected || isCorrect : isSelected;

  // statusClass for "disabled/correct/incorrect" decorations
  let statusClass = "";
  if (disabled && showResultStyles) {
    if (isCorrect) {
      statusClass = "border-green-500 bg-green-500";
    } else if (isSelected) {
      statusClass = "border-destructive/50 bg-destructive/10";
    } else {
      statusClass = "bg-muted";
    }
  }

  return (
    <div
      key={option.label}
      className={
        "border-border flex items-center space-x-3 rounded-lg border p-3 transition-all duration-200 " +
        (disabled
          ? `cursor-not-allowed opacity-90 ${statusClass}`
          : " hover:bg-primary/5 hover:border-primary/30 cursor-pointer")
      }
      onClick={() => !disabled && handleOptionSelect(option.label)}
    >
      <input
        type="radio"
        checked={isChecked}
        id={`option-${option.label}`}
        name={radioName}
        className="h-5 w-5"
        readOnly
        disabled={disabled}
      />{" "}
      <label
        htmlFor={`option-${option.label}`}
        className={
          "text-foreground flex-1 font-medium " +
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

export default SingleChoiceOption;
