const SingleChoiceOption = ({
  option,
  handleOptionSelect,
  selectedOption,
}: {
  option: any;
  handleOptionSelect: (id: string) => void;
  selectedOption: string;
}) => {
  return (
    <div
      key={option.label}
      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 cursor-pointer"
      onClick={() => handleOptionSelect(option.label)}
    >
      <input
        type="radio"
        checked={selectedOption === option.label}
        id={`option-${option.label}`}
        name="single-choice"
        className="w-5 h-5"
        readOnly
      />{" "}
      <label
        htmlFor={`option-${option.label}`}
        className="flex-1 text-gray-700 cursor-pointer font-medium"
      >
        <span className="inline-block w-8 h-8 bg-gray-100 rounded-full text-center leading-8 text-sm font-bold mr-3">
          {option.label}
        </span>
        {option.text}
      </label>
    </div>
  );
};

export default SingleChoiceOption;
