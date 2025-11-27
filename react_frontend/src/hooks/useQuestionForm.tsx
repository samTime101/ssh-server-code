import React, { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import type { Category, SubCategory } from "@/types/category";
import { fetchCategories } from "@/services/admin/category-service";
import { toast } from "sonner";
import {
  createQuestion,
  updateQuestion,
  type CreateQuestionPayload,
} from "@/services/admin/addquestion-service";

export interface QuestionFormData {
  questionText: string;
  description: string;
  categoryId: string;
  subCategories: string[];
  optionType: "single" | "multiple";
  difficulty: "easy" | "medium" | "hard";
  options: Array<{
    label: string;
    text: string;
    isCorrect: boolean;
  }>;
}

export interface UseQuestionFormProps {
  mode: "create" | "edit";
  initialData?: Partial<QuestionFormData>;
  questionId?: string;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
}

export const useQuestionForm = ({
  mode,
  initialData,
  questionId,
  onSuccess,
  onError,
}: UseQuestionFormProps) => {
  const { token } = useAuth();

  const defaultFormData: QuestionFormData = {
    questionText: "",
    description: "",
    categoryId: "",
    subCategories: [],
    optionType: "single",
    difficulty: "easy",
    options: [
      { label: "A", text: "", isCorrect: false },
      { label: "B", text: "", isCorrect: false },
    ],
  };
  console.log("squiggly lines lai banda garum", initialData);

  const [questionFormData, setQuestionFormData] = useState<QuestionFormData>(defaultFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ question: File | null; description: File | null }>({
    question: null,
    description: null,
  });

  useEffect(() => {
    const loadCategories = async () => {
      if (!token) return;

      try {
        const fetchedCategories = await fetchCategories(token);
        setCategories(fetchedCategories?.categories || []);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([]);
      }
    };

    loadCategories();
  }, [token]);

  useEffect(() => {
    if (!questionFormData || !questionFormData.categoryId || categories.length === 0) return;

    const selectedCategory = categories.find((cat) => cat.id == questionFormData.categoryId);
    setSubCategories(selectedCategory?.sub_categories || []);

    console.log("Selected Category ID:", selectedCategory);
    console.log("Sub Categories:", selectedCategory?.sub_categories || []);
    setQuestionFormData((prev) => (prev ? { ...prev, subCategories: [] } : { ...defaultFormData }));
  }, [questionFormData?.categoryId, categories]);

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

  const handleImageChange = (type: 'question' | 'description', file: File | null) => {
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
  if (mode === "create" && !questionFormData?.categoryId) {
    errors.push("Category is required");
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
        options: questionFormData?.options.map((answer) => ({
          label: answer.label,
          text: answer.text,
          is_true: answer.isCorrect,
        })),
        difficulty: questionFormData.difficulty,
        categoryId: parseInt(questionFormData.categoryId),
        sub_categories: questionFormData.subCategories.map((id) => id),
        // subSubCategoryIds: questionFormData.subSubCategoryIds.map((id) => id),
      };
      console.log("Question created successfully API:", apiData);
      let response;
      console.log("Running in mode:", mode);
      if (mode === "create") {
        response = await createQuestion(apiData, selectedImages, token!);
        toast.success("Question created successfully");
      } else {
        if (!questionId) {
          throw new Error("Question ID is required for editing");
        }
        response = await updateQuestion(questionId, apiData, selectedImages, token!);
        toast.success("Question updated successfully");
      }

      onSuccess?.(response)
      console.log("Question created successfully:", response);
      // Reset form or navigate as needed
      setQuestionFormData(defaultFormData);
    } catch (e) {
      console.error(`Failed to ${mode} question:`, e);
      toast.error(`Failed to ${mode} question`);
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
    handleAddSubCategory,
    handleRemoveSubCategory,

    selectedImages,
    handleImageChange,

    handleInputChange,
    handleOptionTypeChange,
    handleAddMoreAnswers,
    handleCorrectAnswerChange,
    handleOptionTextChange,

    isSubmitting,
    handleCreateQuestionSubmit,
  };
};
