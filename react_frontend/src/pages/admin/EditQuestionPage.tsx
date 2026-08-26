// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import EditorField from "@/components/EditorField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { useQuestionForm } from "@/hooks/admin/useQuestionForm";
import { useEffect } from "react";
import ImagePreview from "@/components/ImagePreview";
import type { QuestionStatus } from "@/types/question";

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
    handleRemoveAnswerOption,
    handleOptionTextChange,
    isSubmitting,
    handleCreateQuestionSubmit,
    categories,
    subCategories,
    handleAddCategory,
    handleRemoveCategory,
    handleAddSubCategory,
    handleRemoveSubCategory,
    handleDescriptionChange,
  } = useQuestionForm({
    mode: "edit",
    questionId: selectedQuestion.id,
    onSuccess: (_response) => {
      handleEditSuccess();
    },
    onError: (error) => {
      console.error("Edit failed:", error);
    },
  });

  useEffect(() => {
    if (!selectedQuestion) return;

    const categoryIds = selectedQuestion.category_names
      .map((catName: string) => {
        const category = categories.find((c) => c.name === catName);
        return category?.id.toString() || "";
      })
      .filter(Boolean);

    setQuestionFormData({
      questionText: selectedQuestion.question_text,
      description: selectedQuestion.description,
      optionType: selectedQuestion.option_type,
      difficulty: selectedQuestion.difficulty,
      status: selectedQuestion.status ?? "pending",
      categoryIds: categoryIds,
      subCategories: selectedQuestion.sub_categories_ids || [],
      options:
        selectedQuestion.options?.map((opt: any) => ({
          label: opt.label,
          text: opt.text,
          isCorrect: opt.is_true,
        })) || [],
      contributor: selectedQuestion.contributor,
      contributorSpecialization:
        selectedQuestion.contributor_specialization,
    });
  }, [selectedQuestion, setQuestionFormData, categories]);

  return (
    // @see: AddQuestionForm.tsx
    <form onSubmit={handleCreateQuestionSubmit} className="space-y-6">
      {/* Question Text */}
      <div className="space-y-2">
        <Label htmlFor="questionText">Question Text</Label>
        <Textarea
          id="questionText"
          name="questionText"
          rows={3}
          value={questionFormData.questionText}
          onChange={handleInputChange}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <EditorField
          value={questionFormData.description}
          onChange={handleDescriptionChange}
          placeholder="Additional context or explanation"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Question Image</Label>
          <div className="flex flex-wrap items-center gap-4">
            <Input
              type="file"
              id="questionImage"
              accept="image/*"
              onChange={(e) => handleImageChange("question", e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="questionImage"
              className="border-input hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors"
            >
              <Upload size={16} /> Choose Question Image
            </label>
          </div>
          {(selectedImages.question || selectedQuestion?.question_image_url) && (
            <div className="flex items-start gap-2">
              <ImagePreview
                file={selectedImages.question}
                existingSrc={selectedQuestion?.question_image_url}
                alt="Question image preview"
                className="mt-0 h-20 w-auto max-w-40 object-contain"
              />
              {selectedImages.question && (
                <button
                  type="button"
                  onClick={() => handleImageChange("question", null)}
                  className="text-destructive hover:text-destructive/70"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Description Image */}
        <div className="space-y-2">
          <Label>Description Image</Label>
          <div className="flex flex-wrap items-center gap-4">
            <Input
              type="file"
              id="descriptionImage"
              accept="image/*"
              onChange={(e) => handleImageChange("description", e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="descriptionImage"
              className="border-input hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors"
            >
              <Upload size={16} /> Choose Description Image
            </label>
          </div>
          {(selectedImages.description || selectedQuestion?.description_image_url) && (
            <div className="flex items-start gap-2">
              <ImagePreview
                file={selectedImages.description}
                existingSrc={selectedQuestion?.description_image_url}
                alt="Description image preview"
                className="mt-0 h-20 w-auto max-w-40 object-contain"
              />
              {selectedImages.description && (
                <button
                  type="button"
                  onClick={() => handleImageChange("description", null)}
                  className="text-destructive hover:text-destructive/70"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category & Subcategory Selection */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">
            Categories <span className="text-destructive">*</span>
          </Label>
          <Select value="" onValueChange={(value) => handleAddCategory(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter((cat) => !questionFormData.categoryIds.includes(cat.id.toString()))
                .map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Display selected categories */}
          <div className="mt-2 flex flex-wrap gap-2">
            {questionFormData.categoryIds.map((catId) => {
              const category = categories.find((c) => c.id.toString() === catId);
              return (
                <Badge
                  key={catId}
                  variant="secondary"
                  className="flex items-center gap-1 py-1 pr-1 pl-2"
                >
                  <span className="text-xs">{category?.name || catId}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(catId)}
                    className="hover:bg-muted ml-1 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select value="" onValueChange={(value) => handleAddSubCategory(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subCategories
                .filter((subCat) => !questionFormData.subCategories.includes(subCat.id.toString()))
                .map((subCat) => (
                  <SelectItem key={subCat.id} value={subCat.id.toString()}>
                    {subCat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Display selected subcategories */}
          <div className="mt-2 flex flex-wrap gap-2">
            {questionFormData.subCategories.map((subCatId) => {
              const subCat = subCategories.find((sc) => sc.id.toString() === subCatId);
              return (
                <Badge
                  key={subCatId}
                  variant="secondary"
                  className="flex items-center gap-1 py-1 pr-1 pl-2"
                >
                  <span className="text-xs">{subCat?.name || subCatId}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubCategory(subCatId)}
                    className="hover:bg-muted ml-1 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* Difficulty */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={questionFormData.difficulty}
            onValueChange={(value) =>
              setQuestionFormData((prev) => ({
                ...prev!,
                difficulty: value as "easy" | "medium" | "hard",
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={questionFormData.status}
            onValueChange={(value) =>
              setQuestionFormData((prev) => ({
                ...prev!,
                status: value as QuestionStatus,
              }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              className="text-primary focus:ring-ring h-4 w-4"
            />
            <span className="text-foreground text-sm">Single Correct Answer</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="answerType"
              value="multiple"
              checked={questionFormData.optionType === "multiple"}
              onChange={handleOptionTypeChange}
              className="text-primary focus:ring-ring h-4 w-4"
            />
            <span className="text-foreground text-sm">Multiple Correct Answers</span>
          </label>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-2">
        <Label>Answer Options</Label>
        <div className="space-y-3">
          {questionFormData.options.map((option, index) => (
            <div className="flex items-start gap-3" key={option.label}>
              <div className="mt-2">
                {questionFormData.optionType === "single" ? (
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={option.isCorrect}
                    onChange={(e) => handleCorrectAnswerChange(option.label, e.target.checked)}
                    className="text-primary focus:ring-ring"
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    onChange={(e) => handleCorrectAnswerChange(option.label, e.target.checked)}
                    className="text-primary focus:ring-ring"
                  />
                )}
              </div>
              <div className="text-foreground mt-2 w-8 font-medium">{option.label}</div>
              <Input
                type="text"
                value={option.text}
                className="flex-1"
                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                placeholder={`Enter option ${option.label}`}
              />
              {questionFormData.options.length > 2 && (
                <Button
                  onClick={() => handleRemoveAnswerOption(index)}
                  type="button"
                  variant="destructive"
                >
                  <X />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-primary text-primary bg-card hover:bg-primary/5 mt-3"
          onClick={handleAddMoreAnswers}
        >
          + Add Another Answer
        </Button>
      </div>

      {/* Contributor */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contributor">Contributor (Optional)</Label>
          <Input
            id="contributor"
            name="contributor"
            type="text"
            placeholder="Enter contributor name"
            value={questionFormData?.contributor || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contributorSpecialization">Specialization (Optional)</Label>
          <Input
            id="contributorSpecialization"
            name="contributorSpecialization"
            type="text"
            placeholder="Enter contributor specialization"
            value={questionFormData?.contributorSpecialization || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-border flex justify-end border-t pt-4">
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleCreateQuestionSubmit}
        >
          {isSubmitting ? "Updating..." : " Update Question"}
        </Button>
      </div>
    </form>
  );
};

export default EditQuestionForm;
