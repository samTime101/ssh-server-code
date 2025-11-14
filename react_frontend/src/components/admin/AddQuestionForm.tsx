import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Category, SubCategory, SubSubCategory } from "@/types/category";
import { fetchCategories } from "@/services/admin/category-service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { createQuestion, type ApiQuestionData } from "@/services/admin/addquestion-service";

const AddQuestionForm = () => {
  const { token } = useAuth();

  const initialQuestionData = {
    questionText: "",
    description: "",
    categoryId: "",
    subCategoryIds: [] as string[],
    // subSubCategoryIds: [] as string[],
    questionType: "single" as "single" | "multiple",
    difficulty: "",
    answers: [
      { id: "A", text: "", isCorrect: false },
      { id: "B", text: "", isCorrect: false },
    ],
  };
  const [questionData, setQuestionData] = useState(initialQuestionData);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  // const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    const loadCategories = async () => {
      if (!token) return;

      try {
        const fetchedCategories = await fetchCategories(token);
        console.log("Fetched categories:", fetchedCategories);
        setCategories(fetchedCategories?.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]); // Fallback to empty array
      }
    };

    loadCategories();
  }, [token]);

  useEffect(() => {
    if (!questionData || !questionData.categoryId || categories.length === 0) return;

    const selectedCategory = categories.find((cat) => cat.id == questionData.categoryId);
    setSubCategories(selectedCategory?.sub_categories || []);
    // setSubSubCategories(
    //   selectedCategory?.subCategories.flatMap((subCat) => subCat.subSubCategories) || []
    // );
    console.log("Selected Category ID:", selectedCategory);
    console.log("Sub Categories:", selectedCategory?.sub_categories || []);
    setQuestionData((prev) => ({
      ...prev,
      subCategoryIds: [],
      // subSubCategoryIds: [],
    }));
  }, [questionData.categoryId, categories]);

  const handleAddMoreAnswers = () => {
    if (questionData.answers.length >= 4) {
      toast.error("You can add up to 4 answer options only");
      return;
    }
    setQuestionData((prev) => ({
      ...prev,
      answers: [
        ...prev.answers,
        { id: String.fromCharCode(65 + prev.answers.length), text: "", isCorrect: false },
      ],
    }));
  };

  const handleCorrectAnswerChange = (optionId: string, isCorrect: boolean) => {
    setQuestionData((prev) => {
      const updatedAnswers = prev.answers.map((answer) => {
        if (prev.questionType == "single") {
          return {
            ...answer,
            isCorrect: answer.id == optionId ? isCorrect : false,
          };
        } else {
          return answer.id === optionId ? { ...answer, isCorrect } : answer;
        }
      });

      return {
        ...prev,
        answers: updatedAnswers,
      };
    });
  };

  const handleQuestionTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const questionType = e.target.value as "single" | "multiple";
    setQuestionData((prev) => ({
      ...prev,
      questionType,
      // Reset correct answers when switching types
      answers: prev.answers.map((answer) => ({ ...answer, isCorrect: false })),
    }));
  };

  const handleCreateQuestionSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const apiData: ApiQuestionData = {
        questionText: questionData.questionText,
        description: questionData.description,
        questionType: questionData.questionType,
        options: questionData.answers.map((answer) => ({
          optionId: answer.id,
          text: answer.text,
        })),
        correctAnswers: questionData.answers
          .filter((answer) => answer.isCorrect)
          .map((answer) => answer.id),
        difficulty: questionData.difficulty,
        categoryId: parseInt(questionData.categoryId),
        subCategoryIds: questionData.subCategoryIds.map((id) => id),
        // subSubCategoryIds: questionData.subSubCategoryIds.map((id) => id),
      };
      console.log("Question created successfully API:", apiData);
      const response = await createQuestion(apiData, token!);
      console.log("Question created successfully:", response);
      toast.success("Question created successfully");
      // Reset form or navigate as needed
      setQuestionData(initialQuestionData);
    } catch (e) {
      console.error("Failed to create question:", e);
    }
  };

  return (
    <Card className="shadow-sm border border-gray-200 dark:border-slate-700">
      <CardHeader className="border-b border-gray-200 dark:border-slate-700 pb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Create New Question</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Enter your question here"
              value={questionData.questionText}
              onChange={(e) => handleInputChange(e)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <textarea
              id="description"
              name="description"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Additional context or explanation"
              value={questionData.description}
              onChange={(e) => handleInputChange(e)}
            />
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                name="categoryId"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                value={questionData.categoryId}
                onChange={(e) => handleInputChange(e)}
              >
                <option value="">Select category</option>
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  value=""
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    if (selectedId && !questionData.subCategoryIds.includes(selectedId)) {
                      setQuestionData((prev) => ({
                        ...prev,
                        subCategoryIds: [...prev.subCategoryIds, selectedId], // Add to array
                        subSubCategoryIds: [], // Reset sub-subcategories
                      }));
                    }
                  }}
                >
                  <option value="">Select subcategory</option>
                  {subCategories.map((subCat) => (
                    <option key={subCat.id} value={subCat.id.toString()}>
                      {subCat.name}
                    </option>
                  ))}
                </select>

                {/* Dynamic Chips based on actual selected data */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {questionData.subCategoryIds.map((subCatId) => {
                    const subCat = subCategories.find((sc) => sc.id.toString() === subCatId);
                    return (
                      <Badge
                        key={subCatId}
                        variant="secondary"
                        className="pl-2 pr-1 py-1 flex items-center gap-1"
                      >
                        <span className="text-xs">{subCat?.name || subCatId}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setQuestionData((prev) => ({
                              ...prev,
                              subCategoryIds: prev.subCategoryIds.filter((id) => id !== subCatId),
                              subSubCategoryIds: [], // Reset sub-subcategories when removing subcategory
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
                if (selectedId && !questionData.subSubCategoryIds.includes(selectedId)) {
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
              {questionData.subSubCategoryIds.map((subSubCatId) => {
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              value={questionData.difficulty}
              onChange={(e) => handleInputChange(e)}
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="answerType"
                  value="single"
                  checked={questionData.questionType === "single"}
                  onChange={handleQuestionTypeChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Single Correct Answer
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="answerType"
                  value="multiple"
                  checked={questionData.questionType === "multiple"}
                  onChange={handleQuestionTypeChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
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
              {questionData.answers.map((answer, index) => (
                <div className="flex items-start gap-3" key={`${answer.id}-${index}`}>
                  <div className="mt-2">
                    {questionData.questionType === "single" ? (
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={answer.isCorrect}
                        onChange={(e) => handleCorrectAnswerChange(answer.id, e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={answer.isCorrect}
                        onChange={(e) => handleCorrectAnswerChange(answer.id, e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                    )}
                  </div>
                  <div className="mt-2 w-8 font-medium text-gray-700 dark:text-gray-300">
                    {answer.id}
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter answer option"
                    className="flex-1"
                    value={answer.text}
                    onChange={(e) => {
                      const newText = e.target.value;
                      setQuestionData((prev) => {
                        const updatedAnswers = prev.answers.map((ans, idx) =>
                          idx === index ? { ...ans, text: newText } : ans
                        );
                        return { ...prev, answers: updatedAnswers };
                      });
                    }}
                  />
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={handleAddMoreAnswers}
            >
              + Add Another Answer
            </Button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-slate-700">
            <Button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={handleCreateQuestionSubmit}
            >
              Create Question
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddQuestionForm;
