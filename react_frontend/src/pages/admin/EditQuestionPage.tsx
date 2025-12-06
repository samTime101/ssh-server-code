// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Upload, X } from "lucide-react";
import { useQuestionForm } from "@/hooks/useQuestionForm";
import { useEffect } from "react";

// uta questionbank bata aako data
interface EditQuestionFormProps {
  selectedQuestion: any;
  handleEditSuccess: () => void;
}

const EditQuestionForm = ({ selectedQuestion, handleEditSuccess }: EditQuestionFormProps) => {
  const {
    questionFormData,
    setQuestionFormData,
    selectedImages,
    handleImageChange,
    handleInputChange,
    handleOptionTypeChange,
    handleAddMoreAnswers,
    handleCorrectAnswerChange,
    handleOptionTextChange,
    isSubmitting,
    handleCreateQuestionSubmit,
  } = useQuestionForm({
    mode: "edit",
    questionId: selectedQuestion.id,
    // initial data use nai vako xaina hook ma tesaile nadeko data,
    onSuccess: (response) => {
      console.log("Edit Successful", response);
      handleEditSuccess();
    },
    onError: (error) => {
      console.error("Edit failed:", error)
    }
    ,
  });


  //data lai populate garna ko lagi
    useEffect(() => {
    if (!selectedQuestion) return;
    setQuestionFormData({
        questionText: selectedQuestion.question_text,
        description: selectedQuestion.description,
        optionType: selectedQuestion.option_type,
        difficulty: selectedQuestion.difficulty,
        categoryId: selectedQuestion.category_id,
        subCategories: selectedQuestion.sub_categories_ids,
        options: selectedQuestion.options?.map((opt: any) => ({
        label: opt.label,
        text: opt.text,
        isCorrect: opt.is_true,
        })) || [],
    });
    }, [selectedQuestion, setQuestionFormData]);


  return (
    // @see: react_frontend\src\components\admin\AddQuestionForm.tsx [exacct same code]
        <form onSubmit={handleCreateQuestionSubmit} className="space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="questionText">Question Text</Label>
            <textarea
              id="questionText"
              name="questionText"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:focus:ring-blue-400"
              value={questionFormData.questionText}
              onChange={handleInputChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:focus:ring-blue-400"
              value={questionFormData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Question Image</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="questionImage"
                  accept="image/*"
                  onChange={(e) => handleImageChange('question', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="questionImage"
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  <Upload size={16} /> Choose Question Image
                </label>

                {selectedImages.question ? (
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedImages.question.name}</span>
                    <button
                      type="button"
                      onClick={() => handleImageChange('question', null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : selectedQuestion?.question_image_url ? (
                  <img
                    src={selectedQuestion.question_image_url}
                    alt="Current question"
                    className="h-20 rounded border border-gray-200 dark:border-slate-600"
                  />
                ) : null}
              </div>
            </div>

            {/* Description Image */}
            <div className="space-y-2">
              <Label>Description Image</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="descriptionImage"
                  accept="image/*"
                  onChange={(e) => handleImageChange('description', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label
                  htmlFor="descriptionImage"
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  <Upload size={16} /> Choose Description Image
                </label>

                {selectedImages.description ? (
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{selectedImages.description.name}</span>
                    <button
                      type="button"
                      onClick={() => handleImageChange('description', null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : selectedQuestion?.description_image_url ? (
                  <img
                    src={selectedQuestion.description_image_url}
                    alt="Current description"
                    className="h-20 rounded border border-gray-200 dark:border-slate-600"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Category & Subcategory (Non-editable) */}
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedQuestion.subcategory_names.map((name: string, idx: number) => (
                    <Badge
                    key={idx}
                    variant="secondary"
                    className="flex items-center gap-1 py-1 pr-1 pl-2"
                    >
                    {name}
                    </Badge>
                ))}
            </div>


          {/* Difficulty */}
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <select
              name="difficulty"
              value={questionFormData.difficulty}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:focus:ring-blue-400"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Answer Type */}
          <div className="space-y-2">
            <Label>Answer Type</Label>
            <div className="flex gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="answerType"
                  value="single"
                  checked={questionFormData.optionType === "single"}
                  onChange={handleOptionTypeChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Single Correct Answer
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="answerType"
                  value="multiple"
                  checked={questionFormData.optionType === "multiple"}
                  onChange={handleOptionTypeChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Multiple Correct Answers
                </span>
              </label>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-2">
            <Label>Answer Options</Label>
            <div className="space-y-3">
              {questionFormData.options.map((option, index) => (
                <div className="flex items-center gap-3" key={option.label}>
                  {questionFormData.optionType === "single" ? (
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={option.isCorrect}
                      onChange={(e) =>
                        handleCorrectAnswerChange(option.label, e.target.checked)
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) =>
                        handleCorrectAnswerChange(option.label, e.target.checked)
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  )}
                  <div className="mt-2 w-8 font-medium text-gray-700 dark:text-gray-300">
                    {option.label}
                  </div>
                  <Input
                    type="text"
                    value={option.text}
                    className="flex-1"
                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                    placeholder={`Enter option ${option.label}`}
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
              onClick={handleAddMoreAnswers}
            >
              + Add Another Answer
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end border-t border-gray-200 pt-4 dark:border-slate-700">
            <Button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={handleCreateQuestionSubmit}
            >
              {isSubmitting ? "Updating..." : " Update Question"}
            </Button>
          </div>
        </form>
  );
};

export default EditQuestionForm;
