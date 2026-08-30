import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useSuggestedQuestionForm } from "@/hooks/profile/useSuggestedQuestionForm";
import ImagePreview from "@/components/ImagePreview";

const MySuggestedQuestions = () => {
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
    handleRemoveAnswerOption,
    isSubmitting,
    handleOptionTextChange,
    handleDescriptionChange,
    contributorName,
    onSubmit,
  } = useSuggestedQuestionForm();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">My Suggested Questions</CardTitle>
          <p className="text-muted-foreground mt-1 text-sm">
            Suggest new questions to help improve the question bank
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={onSubmit}>
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
                </div>

                {selectedImages.question && (
                  <div className="flex items-start gap-2">
                    <ImagePreview
                      file={selectedImages.question}
                      alt="Question preview"
                      className="mt-0 h-20 w-auto max-w-40 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageChange("question", null)}
                      className="text-destructive hover:text-destructive/70"
                    >
                      <X size={14} />
                    </button>
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
                </div>

                {selectedImages.description && (
                  <div className="flex items-start gap-2">
                    <ImagePreview
                      file={selectedImages.description}
                      alt="Description preview"
                      className="mt-0 h-20 w-auto max-w-40 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageChange("description", null)}
                      className="text-destructive hover:text-destructive/70"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>
                Description <span className="text-destructive">*</span>
              </Label>
              <EditorField
                value={questionFormData.description}
                onChange={handleDescriptionChange}
                placeholder="Additional context or explanation"
              />
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <Label htmlFor="subcategory">
                  Subcategory <span className="text-destructive">*</span>
                </Label>
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
                      placeholder="Enter option text"
                      className="flex-1"
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(index, e.target.value)}
                    />
                    {questionFormData.options.length > 2 && (
                      <Button
                        onClick={() => handleRemoveAnswerOption(index)}
                        type="button"
                        variant="destructive"
                        size="icon"
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
                <Label htmlFor="contributor">
                  Contributor <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contributor"
                  name="contributor"
                  type="text"
                  disabled
                  readOnly
                  placeholder="Your name will appear here"
                  value={contributorName || questionFormData?.contributor || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contributorSpecialization">
                  Specialization <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contributorSpecialization"
                  name="contributorSpecialization"
                  type="text"
                  placeholder="Enter contributor specialization"
                  required
                  value={questionFormData?.contributorSpecialization || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-border flex justify-end border-t pt-4">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Question"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MySuggestedQuestions;
