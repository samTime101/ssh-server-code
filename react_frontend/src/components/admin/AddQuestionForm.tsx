import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Upload, X } from "lucide-react";
import { useQuestionForm } from "@/hooks/useQuestionForm";

const AddQuestionForm = () => {
  const {
    questionFormData,
    setQuestionFormData,
    categories,
    subCategories,
    handleAddCategory,
    handleRemoveCategory,
    handleAddSubCategory,
    handleRemoveSubCategory,
    selectedImages,
    handleImageChange,
    handleInputChange,
    handleOptionTypeChange,
    handleAddMoreAnswers,
    handleCorrectAnswerChange,
    isSubmitting,
    handleCreateQuestionSubmit,
    handleOptionTextChange,
  } = useQuestionForm({
    mode: "create",
    onSuccess: (response) => {
      console.log("Question created successfully:", response);
    },
    onError: (error) => {
      console.error("Failed to create question:", error);
    },
  });

  return (
    <Card className="border-border border shadow-sm">
      <CardHeader className="border-border border-b pb-4">
        <h2 className="text-foreground text-xl font-semibold">Create New Question</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Fill in the details below to add a new question
        </p>
      </CardHeader>

      <CardContent>
        <form className="space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="questionText">
              Question Text <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="questionText"
              name="questionText"
              rows={3}
              placeholder="Enter your question here"
              value={questionFormData?.questionText}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Question Image */}
            <div className="space-y-2">
              <Label htmlFor="questionImage">Question Image (Optional)</Label>
              <div className="flex items-center gap-2">
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
                  <Upload size={16} />
                  Choose Question Image
                </label>

                {selectedImages.question && (
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-green-600" />
                    <span className="text-muted-foreground text-sm">
                      {selectedImages.question.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleImageChange("question", null)}
                      className="text-destructive hover:text-destructive/70 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Question Image Preview */}
              {selectedImages.question && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(selectedImages.question)}
                    alt="Question preview"
                    className="border-border max-h-48 max-w-xs rounded-md border"
                  />
                </div>
              )}
            </div>

            {/* Description Image */}
            <div className="space-y-2">
              <Label htmlFor="descriptionImage">Description Image (Optional)</Label>
              <div className="flex items-center gap-2">
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
                  <Upload size={16} />
                  Choose Description Image
                </label>

                {selectedImages.description && (
                  <div className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-green-600" />
                    <span className="text-muted-foreground text-sm">
                      {selectedImages.description.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleImageChange("description", null)}
                      className="text-destructive hover:text-destructive/70 ml-2"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Description Image Preview */}
              {selectedImages.description && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(selectedImages.description)}
                    alt="Description preview"
                    className="border-border max-h-48 max-w-xs rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={2}
              placeholder="Additional context or explanation"
              value={questionFormData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
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

              {/* Dynamic Chips for selected categories */}
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
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select value="" onValueChange={(value) => handleAddSubCategory(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategories
                      .filter(
                        (subCat) => !questionFormData.subCategories.includes(subCat.id.toString())
                      )
                      .map((subCat) => (
                        <SelectItem key={subCat.id} value={subCat.id.toString()}>
                          {subCat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Chips based on actual selected data */}
              <div className="flex flex-wrap gap-2">
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

          {/* Sub-subcategory Selection */}
          {/* <div className="space-y-2">
            <Label htmlFor="subsubcategory">Sub-subcategory</Label>
            <select
              id="subsubcategory"
              name="subSubCategoryIds"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              value=""
              onChange={(e) => {
                const selectedId = e.target.value;
                if (selectedId && !questionFormData.subSubCategoryIds.includes(selectedId)) {
                  setQuestionData((prev) => ({
                    ...prev,
                    subSubCategoryIds: [...prev.subSubCategoryIds, selectedId], // Add to array
                  }));
                }
              }}
            >
              <option value="">Select sub-subcategory</option>
              {subSubCategories.map((subSubCat) => (
                <option key={subSubCat.id} value={subSubCat.id.toString()}>
                  {subSubCat.name}
                </option>
              ))}
            </select> */}

          {/* Dynamic Chips for Sub-subcategories */}
          {/* <div className="flex flex-wrap gap-2 mt-2">
              {questionFormData.subSubCategoryIds.map((subSubCatId) => {
                const subSubCat = subSubCategories.find((ssc) => ssc.id.toString() === subSubCatId);
                return (
                  <Badge
                    key={subSubCatId}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    <span className="text-xs">{subSubCat?.name || subSubCatId}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionData((prev) => ({
                          ...prev,
                          subSubCategoryIds: prev.subSubCategoryIds.filter(
                            (id) => id !== subSubCatId
                          ),
                        }));
                      }}
                      className="ml-1 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div> */}

          {/* Difficulty */}
          <div className="space-y-2">
            <Label htmlFor="difficulty">
              Difficulty <span className="text-destructive">*</span>
            </Label>
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

          {/* Answer Type */}
          <div className="space-y-2">
            <Label>
              Answer Type <span className="text-destructive">*</span>
            </Label>
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
            <Label>
              Answer Options <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-3">
              {/* Answer Option A */}
              {questionFormData.options.map((option, index) => (
                <div className="flex items-start gap-3" key={`${option.label}-${index}`}>
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
                    placeholder="Enter option option"
                    className="flex-1"
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                  />
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
              {isSubmitting ? "Creating..." : "Create Question"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddQuestionForm;
