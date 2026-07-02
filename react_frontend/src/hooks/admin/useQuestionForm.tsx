import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Category, SubCategory } from "@/types/category";
import { fetchCategoriesWithHierarchy } from "@/services/admin/category-service";
import { toast } from "sonner";
import {
  createQuestion,
  searchQuestions,
  updateQuestion,
} from "@/services/admin/addquestion-service";
import type {
  CreateQuestionPayload,
  QuestionFormData,
  UseQuestionFormProps,
} from "@/types/question";
import { collectSubcategoriesFromCategories } from "@/utils/categoryUtils";
import { extractBackendErrorMessages } from "@/utils/errorUtils";

export const useQuestionForm = ({ mode, questionId, onSuccess, onError }: UseQuestionFormProps) => {
  const { token } = useAuth();

  const defaultFormData: QuestionFormData = {
    questionText: "",
    description: "",
    categoryIds: [],
    subCategories: [],
    optionType: "single",
    difficulty: "easy",
    status: "pending",
    options: [
      { label: "A", text: "", isCorrect: false },
      { label: "B", text: "", isCorrect: false },
    ],
    contributor: "",
    contributorSpecialization: "",
  };

  const [questionFormData, setQuestionFormData] = useState<QuestionFormData>(defaultFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{
    question: File | null;
    description: File | null;
  }>({
    question: null,
    description: null,
  });

  useEffect(() => {
    const loadCategories = async () => {
      if (!token) return;

      try {
        const fetchedCategories = await fetchCategoriesWithHierarchy();
        setCategories(fetchedCategories?.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, [token]);

  useEffect(() => {
    if (!questionFormData || questionFormData.categoryIds.length === 0 || categories.length === 0)
      return;

    const allSubCategories = collectSubcategoriesFromCategories(
      questionFormData.categoryIds,
      categories
    );
    setSubCategories(allSubCategories);
  }, [questionFormData?.categoryIds, categories]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuestionFormData((prev) => (prev ? { ...prev, [name]: value } : { ...defaultFormData }));
  };

  const handleAddMoreAnswers = () => {
    if (!questionFormData) return;
    if (questionFormData.options.length >= 6) {
      toast.error("You can add up to 6 answer options only");
      return;
    }

    setQuestionFormData((prev) =>
      prev
        ? {
          ...prev,
          options: [
            ...prev.options,
            {
              label: String.fromCharCode(65 + prev.options.length),
              text: "",
              isCorrect: false,
            },
          ],
        }
        : { ...defaultFormData }
    );
  };

  const handleCorrectAnswerChange = (optionLabel: string, isCorrect: boolean) => {
    setQuestionFormData((prev) => {
      if (!prev) return prev;
      const updatedAnswers = prev?.options.map((option) => {
        if (prev.optionType == "single") {
          return {
            ...option,
            isCorrect: option.label == optionLabel ? isCorrect : false,
          };
        } else {
          return option.label === optionLabel ? { ...option, isCorrect } : option;
        }
      });

      return {
        ...prev,
        options: updatedAnswers,
      };
    });
  };

  const handleOptionTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const questionType = e.target.value as "single" | "multiple";
    setQuestionFormData((prev) =>
      prev
        ? {
          ...prev,
          optionType: questionType,
          options: prev.options.map((option) => ({ ...option, isCorrect: false })),
        }
        : { ...defaultFormData }
    );
  };

  const handleOptionTextChange = (index: number, newText: string) => {
    setQuestionFormData((prev) =>
      prev
        ? {
          ...prev,
          options: prev.options.map((option, idx) =>
            idx === index ? { ...option, text: newText } : option
          ),
        }
        : { ...defaultFormData }
    );
  };

  const handleRemoveAnswerOption = (index: number) => {
    if (!questionFormData || questionFormData.options.length <= 2) {
      toast.error("A question must have at least 2 answer options");
      return;
    }

    setQuestionFormData((prev) => {
      if (!prev) return prev;
      const updatedOptions = prev.options.filter((_, idx) => idx !== index);
      const relabeledOptions = updatedOptions.map((option, idx) => ({
        ...option,
        label: String.fromCharCode(65 + idx),
      }));
      return {
        ...prev,
        options: relabeledOptions,
      };
    });
  }

  const handleAddCategory = (categoryId: string) => {
    if (categoryId && !questionFormData?.categoryIds.includes(categoryId)) {
      setQuestionFormData((prev) =>
        prev
          ? {
            ...prev,
            categoryIds: [...prev.categoryIds, categoryId],
          }
          : { ...defaultFormData, categoryIds: [categoryId] }
      );
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setQuestionFormData((prev) => {
      if (!prev) return { ...defaultFormData };

      // Find the category being removed to get its subcategories
      const removedCategory = categories.find((cat) => cat.id.toString() === categoryId);
      const removedSubCategoryIds =
        removedCategory?.sub_categories?.map((subCat) => subCat.id.toString()) || [];

      return {
        ...prev,
        categoryIds: prev.categoryIds.filter((id) => id !== categoryId),
        // Also remove subcategories that belong to the removed category
        subCategories: prev.subCategories.filter(
          (subCatId) => !removedSubCategoryIds.includes(subCatId)
        ),
      };
    });
  };

  const handleAddSubCategory = (subCategoryId: string) => {
    if (subCategoryId && !questionFormData?.subCategories.includes(subCategoryId)) {
      setQuestionFormData((prev) =>
        prev
          ? {
            ...prev,
            subCategories: [...prev.subCategories, subCategoryId],
          }
          : { ...defaultFormData, subCategories: [subCategoryId] }
      );
    }
  };

  const handleRemoveSubCategory = (subCategoryId: string) => {
    setQuestionFormData((prev) =>
      prev
        ? {
          ...prev,
          subCategories: prev.subCategories.filter((id) => id !== subCategoryId),
        }
        : { ...defaultFormData }
    );
  };
  
  const validateCategories = (
    categoryIds: string[],
    subCategoryIds: string[]
  ): string[] => {
    const errors: string[] = [];

    categoryIds.forEach((categoryId) => {
      const category = categories.find((cat) => cat.id.toString() === categoryId);

      if (
        category &&
        !category.sub_categories?.some((subCat) =>
          subCategoryIds.includes(subCat.id.toString())
        )
      ) {
        errors.push(
          `Category "${category.name}" must have at least one subcategory selected`
        );
      }
    });

    return errors;
  };

  const handleDescriptionChange = (value: string) => {
    setQuestionFormData((prev) => ({ ...(prev ?? defaultFormData), description: value }));
  };

  const handleImageChange = (type: "question" | "description", file: File | null) => {
    setSelectedImages((prev) => ({ ...prev, [type]: file }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!questionFormData) {
      errors.push("Form data is missing");
      return errors;
    }

    if (!questionFormData.questionText.trim()) {
      errors.push("Question text is required");
    }

    // edit mode ma aaile lai chaidaina
    if (
      mode === "create" &&
      (!questionFormData?.categoryIds || questionFormData.categoryIds.length === 0)
    ) {
      errors.push("At least one category is required");
    }

    if (
      mode === "create" &&
      (!questionFormData?.subCategories || questionFormData.subCategories.length === 0)
    ) {
      errors.push("At least one subcategory is required");
    }

    // Validate that each category has at least one subcategory
    if (questionFormData?.categoryIds.length > 0) {
      const categoryValidationErrors = validateCategories(
        questionFormData.categoryIds,
        questionFormData.subCategories
      );
      errors.push(...categoryValidationErrors);
    }

    if (!questionFormData?.difficulty) {
      errors.push("Difficulty is required");
    }

    if (questionFormData?.options.some((option) => !option.text.trim())) {
      errors.push("All answer options must have text");
    }

    if (!questionFormData?.options.some((option) => option.isCorrect)) {
      errors.push("At least one correct answer must be selected");
    }

    return errors;
  };

  const resetForm = () => {
    setQuestionFormData(defaultFormData);
    setSelectedImages({ question: null, description: null });
  };

  const handleCreateQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    if (!questionFormData) return;
    setIsSubmitting(true);
    try {
      const apiData: CreateQuestionPayload = {
        question_text: questionFormData.questionText,
        description: questionFormData.description,
        option_type: questionFormData?.optionType,
        status: questionFormData.status,
        options: questionFormData?.options.map((answer) => ({
          label: answer.label,
          text: answer.text,
          is_true: answer.isCorrect,
        })),
        difficulty: questionFormData.difficulty,
        sub_categories: questionFormData.subCategories.map((id) => id),
        // subSubCategoryIds: questionFormData.subSubCategoryIds.map((id) => id),
        ...(questionFormData.contributor?.trim() && {
          contributor: questionFormData.contributor,
        }),
        ...(questionFormData.contributorSpecialization?.trim() && {
          contributor_specialization: questionFormData.contributorSpecialization,
        }),
      };
      let response;
      if (mode === "create") {
        // Check for duplicate question text before submitting
        const searchResult = await searchQuestions(questionFormData.questionText.trim());
        const duplicate = searchResult?.results?.find(
          (q: { question_text: string }) =>
            q.question_text.trim().toLowerCase() ===
            questionFormData.questionText.trim().toLowerCase()
        );
        if (duplicate) {
          toast.error("A question with this text already exists.");
          setIsSubmitting(false);
          return;
        }
        response = await createQuestion(apiData, selectedImages);
        toast.success("Question created successfully");
      } else {
        if (!questionId) {
          throw new Error("Question ID is required for editing");
        }
        response = await updateQuestion(questionId, apiData, selectedImages);
        toast.success("Question updated successfully");
      }

      onSuccess?.(response);
      resetForm();
    } catch (e: any) {
      console.error(`Failed to ${mode} question:`, e);
      const data = e?.response?.data;
      if (data && typeof data === "object") {
        const messages = extractBackendErrorMessages(data);
        if (messages.length > 0) {
          messages.forEach((msg) => toast.error(msg));
        } else {
          toast.error(`Failed to ${mode} question`);
        }
      } else {
        toast.error(`Failed to ${mode} question`);
      }
      onError?.(e as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    questionFormData,
    setQuestionFormData,

    categories,
    setCategories,

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
    handleOptionTextChange,

    isSubmitting,
    handleDescriptionChange,
    handleCreateQuestionSubmit,

    resetForm,
  };
};
