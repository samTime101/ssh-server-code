import React, { useEffect, useState } from "react";
// import AdminPanel from "../admin-panel";
import { createQuestion } from "@/services/addquestion-service";
import { createCategory, type Category } from "@/services/category-service";
import { getCategories, type SubCategory } from "@/services/subcategory-service";
import type { AuthToken } from "@/types/auth";
import { useAuth } from "@/hooks/useAuth";

const AddQuestionPage = () => {
  // Form state
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    questionText: "",
    description: "",
    categoryId: "",
    subCategoryId: [] as string[],
    subSubCategoryId: [] as string[],
    questionType: "single" as "single" | "multiple",
    difficulty: "medium",
    answers: [
      { id: "A", text: "", isCorrect: false },
      { id: "B", text: "", isCorrect: false },
    ],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!token) {
          throw new Error("Access token not found");
        }
        const tokenString = localStorage.getItem("accessToken");
        if (!tokenString) {
          throw new Error("Access token not found");
        }
        // const token: AuthToken = { access: tokenString, refresh: "" };
        const result = await getCategories(token);
        setCategories(result.categories);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Failed to fetch categories:", error.message);
        } else {
          console.error("An unexpected error occurred while fetching categories.");
        }
      }
    };
    fetchCategories();
  }, [token]);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const selectedCategory = categories.find(
        (c) => c.categoryId === parseInt(formData.categoryId)
      );
      setSubCategories(selectedCategory?.subCategories || []);
      // Reset subcategory and sub-subcategory when category changes
      setFormData((prev) => ({
        ...prev,
        subCategoryId: [],
        subSubCategoryId: [],
      }));
      setSubSubCategories([]);
    }
  }, [formData.categoryId, categories]);

  // Update sub-subcategories when subcategory changes
  useEffect(() => {
    if (formData.subCategoryId.length > 0) {
      const selectedSubCategory = subCategories.find(
        (sc) => sc.subCategoryId === parseInt(formData.subCategoryId[0])
      );
      setSubSubCategories(selectedSubCategory?.subCategories || []);
      // Reset sub-subcategory when subcategory changes
      setFormData((prev) => ({
        ...prev,
        subSubCategoryId: [],
      }));
    }
  }, [formData.subCategoryId, subCategories]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const questionType = e.target.value as "single" | "multiple";
    setFormData((prev) => ({
      ...prev,
      questionType,
      // Reset correct answers when switching types
      answers: prev.answers.map((answer) => ({ ...answer, isCorrect: false })),
    }));
  };

  const handleAnswerTextChange = (id: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.map((answer) => (answer.id === id ? { ...answer, text } : answer)),
    }));
  };

  const handleCorrectAnswerChange = (id: string, isCorrect: boolean) => {
    setFormData((prev) => {
      // For single answer type, ensure only one answer is marked as correct
      const updatedAnswers = prev.answers.map((answer) => {
        if (prev.questionType === "single") {
          return {
            ...answer,
            isCorrect: answer.id === id ? isCorrect : false,
          };
        } else {
          return answer.id === id ? { ...answer, isCorrect } : answer;
        }
      });

      return { ...prev, answers: updatedAnswers };
    });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, subCategoryId: selectedOptions }));
  };

  const handleSubSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, subSubCategoryId: selectedOptions }));
  };

  const addAnswerOption = () => {
    // Generate next letter ID (A, B, C, D, etc.)
    const nextId = String.fromCharCode(65 + formData.answers.length);
    setFormData((prev) => ({
      ...prev,
      answers: [...prev.answers, { id: nextId, text: "", isCorrect: false }],
    }));
  };

  const removeAnswerOption = (id: string) => {
    if (formData.answers.length <= 2) return; // Keep at least 2 options
    setFormData((prev) => ({
      ...prev,
      answers: prev.answers.filter((answer) => answer.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.questionText.trim()) {
      alert("Please enter a question");
      return;
    }

    if (!formData.categoryId) {
      alert("Please select a category");
      return;
    }

    const correctAnswers = formData.answers.filter((a) => a.isCorrect);
    if (correctAnswers.length === 0) {
      alert("Please select at least one correct answer");
      return;
    }

    if (formData.answers.some((a) => !a.text.trim())) {
      alert("Please fill in all answer options");
      return;
    }

    try {
      // Prepare data for API
      const apiData: ApiQuestionData = {
        questionText: formData.questionText,
        questionType: formData.questionType,
        options: formData.answers.map((answer) => ({
          optionId: answer.id,
          text: answer.text,
        })),
        correctAnswers: formData.answers
          .filter((answer) => answer.isCorrect)
          .map((answer) => answer.id),
        difficulty: formData.difficulty,
        categoryId: formData.categoryId,
        subCategoryId: formData.subCategoryId.map((id) => parseInt(id)),
        subSubCategoryId: formData.subSubCategoryId.map((id) => parseInt(id)),
      };

      // Add description if provided
      if (formData.description.trim()) {
        apiData.description = formData.description;
      }

      // Submit the form data
      const tokenString = localStorage.getItem("accessToken");
      if (!tokenString) {
        alert("Authentication token not found");
        return;
      }

      const token: AuthToken = { access: tokenString, refresh: "" };
      await createQuestion(apiData, token);

      alert("Question added successfully!");

      // Reset form
      setFormData({
        questionText: "",
        description: "",
        categoryId: "",
        subCategoryId: [],
        subSubCategoryId: [],
        questionType: "single",
        difficulty: "medium",
        answers: [
          { id: "A", text: "", isCorrect: false },
          { id: "B", text: "", isCorrect: false },
        ],
      });
      setSubCategories([]);
      setSubSubCategories([]);
    } catch (error) {
      console.error("Error creating question:", error);
      alert("Failed to add question. Please try again.");
    }
  };

  return (
    <>
      {/* <AdminPanel /> */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Question</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* Question Text */}
            <div className="mb-6">
              <label
                htmlFor="questionText"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Question Text *
              </label>
              <textarea
                id="questionText"
                name="questionText"
                value={formData.questionText}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter your question here"
              />
            </div>

            {/* Question Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional context or explanation"
              />
            </div>

            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Main Category */}
              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label
                  htmlFor="subCategoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subcategory
                </label>
                <select
                  id="subCategoryId"
                  name="subCategoryId"
                  multiple
                  value={formData.subCategoryId}
                  onChange={handleSubCategoryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.categoryId}
                  size={3}
                >
                  {subCategories.map((subCategory) => (
                    <option key={subCategory.subCategoryId} value={subCategory.subCategoryId}>
                      {subCategory.subCategoryName}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              {/* Sub-subcategory */}
              <div>
                <label
                  htmlFor="subSubCategoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sub-subcategory
                </label>
                <select
                  id="subSubCategoryId"
                  name="subSubCategoryId"
                  multiple
                  value={formData.subSubCategoryId}
                  onChange={handleSubSubCategoryChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={formData.subCategoryId.length === 0}
                  size={3}
                >
                  {subSubCategories.map((subSubCategory) => (
                    <option key={subSubCategory.subCategoryId} value={subSubCategory.subCategoryId}>
                      {subSubCategory.subCategoryName}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty *
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Answer Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Answer Type *</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="questionType"
                    value="single"
                    checked={formData.questionType === "single"}
                    onChange={handleQuestionTypeChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Single Correct Answer</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="questionType"
                    value="multiple"
                    checked={formData.questionType === "multiple"}
                    onChange={handleQuestionTypeChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Multiple Correct Answers</span>
                </label>
              </div>
            </div>

            {/* Answer Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer Options *
              </label>
              <div className="space-y-3">
                {formData.answers.map((answer) => (
                  <div key={answer.id} className="flex items-start space-x-3">
                    {/* Correct Answer Indicator */}
                    <div className="mt-2">
                      {formData.questionType === "single" ? (
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

                    {/* Answer ID */}
                    <div className="w-8 mt-2 font-medium">{answer.id}.</div>

                    {/* Answer Text Input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={answer.text}
                        onChange={(e) => handleAnswerTextChange(answer.id, e.target.value)}
                        placeholder="Enter answer option"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Remove Button (only show if more than 2 options) */}
                    {formData.answers.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeAnswerOption(answer.id)}
                        className="mt-2 text-red-600 hover:text-red-800"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Answer Button */}
              {formData.answers.length < 26 && ( // Limit to A-Z
                <button
                  type="button"
                  onClick={addAnswerOption}
                  className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add another answer
                </button>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddQuestionPage;
