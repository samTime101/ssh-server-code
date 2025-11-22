import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Upload, X } from "lucide-react";
import { useQuestionForm } from "@/hooks/useQuestionForm";

const AddQuestionForm = () => {
  const {
    questionFormData,
    categories,
    subCategories,
    handleAddSubCategory,
    handleRemoveSubCategory,
    selectedImage,
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
    <Card className="border border-gray-200 shadow-sm dark:border-slate-700">
      <CardHeader className="border-b border-gray-200 pb-4 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create New Question</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Fill in the details below to add a new question
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        <form className="space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="questionText">
              Question Text <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="questionText"
              name="questionText"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:focus:ring-blue-400"
              placeholder="Enter your question here"
              value={questionFormData?.questionText}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionImage">Question Image (Optional)</Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="questionImage"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label
                htmlFor="questionImage"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors hover:bg-gray-50 dark:border-slate-600 dark:hover:bg-slate-700"
              >
                <Upload size={16} />
                Choose Image
              </label>

              {selectedImage && (
                <div className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-green-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedImage.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleImageChange(null)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Image Preview */}
            {selectedImage && (
              <div className="mt-3">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Question preview"
                  className="max-h-48 max-w-xs rounded-md border border-gray-200 dark:border-slate-600"
                />
              </div>
            )}
          </div>
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <textarea
              id="description"
              name="description"
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:focus:ring-blue-400"
              placeholder="Additional context or explanation"
              value={questionFormData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                name="categoryId"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:focus:ring-blue-400"
                value={questionFormData.categoryId}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <select
                  id="subcategory"
                  name="subCategoryIds"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:focus:ring-blue-400"
                  value=""
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    if (selectedId) {
                      handleAddSubCategory(selectedId);
                    }
                  }}
                >
                  <option value="" disabled>
                    Select subcategory
                  </option>
                  {subCategories
                    .filter(
                      (subCat) => !questionFormData.subCategories.includes(subCat.id.toString())
                    )
                    .map((subCat) => (
                      <option key={subCat.id} value={subCat.id.toString()}>
                        {subCat.name}
                      </option>
                    ))}
                </select>

                {/* Dynamic Chips based on actual selected data */}
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
                          className="ml-1 rounded-full p-0.5 hover:bg-gray-300 dark:hover:bg-slate-600"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
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
              Difficulty <span className="text-red-500">*</span>
            </Label>
            <select
              id="difficulty"
              name="difficulty"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 dark:focus:ring-blue-400"
              value={questionFormData.difficulty}
              onChange={handleInputChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Answer Type */}
          <div className="space-y-2">
            <Label>
              Answer Type <span className="text-red-500">*</span>
            </Label>
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
            <Label>
              Answer Options <span className="text-red-500">*</span>
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
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => handleCorrectAnswerChange(option.label, e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    )}
                  </div>
                  <div className="mt-2 w-8 font-medium text-gray-700 dark:text-gray-300">
                    {option.label}
                  </div>
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
              {isSubmitting ? "Creating..." : "Create Question"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddQuestionForm;
