import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  createQuestionSet,
  deleteQuestionSet,
  fetchQuestionSets,
  fetchSelectableQuestions,
  updateQuestionSet,
} from "@/services/admin/questionset-service";
import { fetchConstraints } from "@/services/admin/constraint-service";
import { fetchCategoriesWithHierarchy } from "@/services/admin/category-service";
import type { Category, SubCategory } from "@/types/category";
import type { Constraint } from "@/types/constraint";
import type { QuestionSet, QuestionSetPayload, SelectableQuestion } from "@/types/questionset";
import { extractQuestionIds } from "@/utils/questionSetUtils";

const INITIAL_FORM_STATE = {
  name: "",
  description: "",
};

export const useManageQuestionSets = () => {
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<QuestionSet | null>(null);
  const [name, setName] = useState(INITIAL_FORM_STATE.name);
  const [description, setDescription] = useState(INITIAL_FORM_STATE.description);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pickerQuestions, setPickerQuestions] = useState<SelectableQuestion[]>([]);
  const [pickerSearch, setPickerSearch] = useState("");
  const [debouncedPickerSearch, setDebouncedPickerSearch] = useState("");
  const [pickerPage, setPickerPage] = useState(1);
  const [pickerPageSize, setPickerPageSize] = useState(5);
  const [pickerTotalPages, setPickerTotalPages] = useState(1);
  const [pickerTotalCount, setPickerTotalCount] = useState(0);
  const [isPickerLoading, setIsPickerLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("all");
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [selectedConstraintId, setSelectedConstraintId] = useState("none");

  const subCategories: SubCategory[] =
    categories.find((category) => category.id === selectedCategoryId)?.sub_categories ?? [];

  useEffect(() => {
    loadSets();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategoriesWithHierarchy();
        setCategories(data.categories);
      } catch {
        toast.error("Failed to load categories");
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadConstraints = async () => {
      try {
        const data = await fetchConstraints();
        setConstraints(data.constraints);
      } catch {
        toast.error("Failed to load constraints");
      }
    };

    loadConstraints();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedPickerSearch(pickerSearch.trim());
      setPickerPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [pickerSearch]);

  useEffect(() => {
    if (!isFormOpen) return;

    const loadPickerQuestions = async () => {
      setIsPickerLoading(true);
      try {
        const data = await fetchSelectableQuestions(
          pickerPage,
          pickerPageSize,
          debouncedPickerSearch,
          selectedCategoryId === "all" ? undefined : selectedCategoryId,
          selectedSubCategoryId === "all" ? undefined : selectedSubCategoryId
        );
        setPickerQuestions(data.results);
        setPickerTotalPages(Math.max(1, data.total_pages || 1));
        setPickerTotalCount(data.count || 0);
      } catch {
        toast.error("Failed to load questions");
      } finally {
        setIsPickerLoading(false);
      }
    };

    loadPickerQuestions();
  }, [
    isFormOpen,
    pickerPage,
    pickerPageSize,
    debouncedPickerSearch,
    selectedCategoryId,
    selectedSubCategoryId,
  ]);

  const selectedCount = selectedQuestionIds.length;
  const selectedConstraint =
    selectedConstraintId === "none"
      ? null
      : (constraints.find((constraint) => constraint.id === selectedConstraintId) ?? null);
  const constraintTotalRequired = selectedConstraint
    ? selectedConstraint.rules.reduce((sum, rule) => sum + rule.count, 0)
    : 0;

  const selectedQuestionTextById = useMemo(() => {
    const map = new Map<string, string>();

    sets.forEach((set) => {
      set.questions.forEach((question) => {
        if (question.id && question.question_text) {
          map.set(question.id, question.question_text);
        }
      });
    });

    pickerQuestions.forEach((question) => {
      map.set(question.id, question.question_text);
    });

    return map;
  }, [sets, pickerQuestions]);

  const loadSets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchQuestionSets();
      setSets(data.sets);
    } catch {
      toast.error("Failed to load question sets");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName(INITIAL_FORM_STATE.name);
    setDescription(INITIAL_FORM_STATE.description);
    setSelectedQuestionIds([]);
    setEditingSet(null);
    setPickerSearch("");
    setDebouncedPickerSearch("");
    setPickerPage(1);
    setSelectedCategoryId("all");
    setSelectedSubCategoryId("all");
    setSelectedConstraintId("none");
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (set: QuestionSet) => {
    setEditingSet(set);
    setName(set.name);
    setDescription(set.description || "");
    setSelectedQuestionIds(extractQuestionIds(set.questions));
    setSelectedConstraintId("none");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const buildPayload = (): QuestionSetPayload => {
    const payload: QuestionSetPayload = {
      name: name.trim(),
      description: description.trim(),
      question_ids: selectedQuestionIds,
    };

    if (selectedConstraintId !== "none") {
      payload.constraint = selectedConstraintId;
    }

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Set name is required");
      return;
    }

    if (selectedConstraintId !== "none") {
      if (!selectedConstraint) {
        toast.error("Selected constraint could not be found");
        return;
      }
      if (constraintTotalRequired === 0) {
        toast.error("Constraint rules are missing");
        return;
      }
      if (selectedCount !== constraintTotalRequired) {
        toast.error(`Selected questions must match constraint total (${constraintTotalRequired}).`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      if (editingSet) {
        await updateQuestionSet(editingSet.id, payload);
        toast.success("Question set updated successfully");
      } else {
        await createQuestionSet(payload);
        toast.success("Question set created successfully");
      }
      closeForm();
      await loadSets();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save question set");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (set: QuestionSet) => {
    if (!window.confirm(`Delete "${set.name}"?`)) return;

    try {
      await deleteQuestionSet(set.id);
      toast.success("Question set deleted successfully");
      await loadSets();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete question set");
    }
  };

  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const toggleCurrentPageQuestions = () => {
    const currentIds = pickerQuestions.map((question) => question.id);
    const allCurrentSelected =
      currentIds.length > 0 &&
      currentIds.every((questionId) => selectedQuestionIds.includes(questionId));

    setSelectedQuestionIds((prev) => {
      if (allCurrentSelected) {
        return prev.filter((id) => !currentIds.includes(id));
      }

      const merged = new Set([...prev, ...currentIds]);
      return Array.from(merged);
    });
  };

  const removeSelectedQuestion = (questionId: string) => {
    setSelectedQuestionIds((prev) => prev.filter((id) => id !== questionId));
  };

  const handlePickerCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setSelectedSubCategoryId("all");
    setPickerPage(1);
  };

  const handlePickerSubCategoryChange = (value: string) => {
    setSelectedSubCategoryId(value);
    setPickerPage(1);
  };

  const isCurrentPageFullySelected =
    pickerQuestions.length > 0 &&
    pickerQuestions.every((question) => selectedQuestionIds.includes(question.id));

  return {
    sets,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    editingSet,
    name,
    setName,
    description,
    setDescription,
    selectedQuestionIds,
    selectedQuestionTextById,
    selectedCount,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,

    pickerQuestions,
    pickerSearch,
    setPickerSearch,
    pickerPage,
    setPickerPage,
    pickerPageSize,
    setPickerPageSize,
    pickerTotalPages,
    pickerTotalCount,
    isPickerLoading,
    categories,
    subCategories,
    selectedCategoryId,
    selectedSubCategoryId,
    isCurrentPageFullySelected,
    handlePickerCategoryChange,
    handlePickerSubCategoryChange,
    toggleQuestionSelection,
    toggleCurrentPageQuestions,
    removeSelectedQuestion,
    constraints,
    selectedConstraintId,
    setSelectedConstraintId,
    constraintTotalRequired,
  };
};
