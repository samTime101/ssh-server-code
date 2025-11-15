import { Checkbox } from "@/components/ui/checkbox";

const MultipleChoiceOption = ({
  option,
  handleOptionSelect,
  selectedOptions,
}: {
  option: any;
  handleOptionSelect: (id: string) => void;
  selectedOptions: string[];
}) => {
  return (
    <div
      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
      onClick={() => handleOptionSelect(option.label)}
    >
      <Checkbox
        id={`option-${option.label}`}
        className="w-5 h-5"
        checked={selectedOptions.includes(option.label)}
      />
      <label
        htmlFor={`option-${option.label}`}
        className="flex-1 text-gray-700 cursor-pointer font-medium p-2 hover:bg-blue-50 hover:border-blue-300 rounded-lg transition-all duration-200 pointer-events-none"
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
