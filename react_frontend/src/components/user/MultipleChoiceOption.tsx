import { Checkbox } from "@/components/ui/checkbox";

const MultipleChoiceOption = ({
  option,
  handleOptionSelect,
  selectedOptions,
  disabled = false,
  isCorrectAttempt,
}: {
  option: any;
  handleOptionSelect: (id: string) => void;
  selectedOptions: string[];
  disabled?: boolean;
  isCorrectAttempt?: boolean;
}) => {
  const isSelected = selectedOptions.includes(option.label);

  // statusClass for "disabled/correct/incorrect" decorations
  let statusClass = "";
  if (disabled) {
    if (isSelected) {
      statusClass = isCorrectAttempt ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50";
    } else {
      statusClass = "bg-gray-100";
    }
  }

  return (
    <div
      className={
        "flex items-center space-x-3 p-3 rounded-lg border border-gray-200 transition-all duration-200 " +
        (disabled ? ` cursor-not-allowed opacity-90 ${statusClass}` : " hover:bg-blue-50 hover:border-blue-300 cursor-pointer")
      }
      onClick={() => !disabled && handleOptionSelect(option.label)}
    >
      <Checkbox
        id={`option-${option.label}`}
        className="w-5 h-5"
        checked={isSelected}
        disabled={disabled}
        onCheckedChange={() => !disabled && handleOptionSelect(option.label)}
      />
      <label
        htmlFor={`option-${option.label}`}
        className={"flex-1 text-gray-700 font-medium p-2 rounded-lg transition-all duration-200 " + (disabled ? "cursor-not-allowed" : "cursor-pointer")}
      >
        <span className="inline-block w-8 h-8 bg-gray-100 rounded-full text-center leading-8 text-sm font-bold mr-3">
          {option.label}
        </span>
        {option.text}
      </label>
    </div>
  );
};

export default MultipleChoiceOption;
