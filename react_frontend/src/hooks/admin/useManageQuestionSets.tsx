import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  createQuestionSet,
  deleteQuestionSet,
  fetchQuestionSets,
  fetchSelectableQuestions,
  updateQuestionSet,
} from "@/services/admin/questionset-service";
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

  useEffect(() => {
    loadSets();
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
          debouncedPickerSearch
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
  }, [isFormOpen, pickerPage, pickerPageSize, debouncedPickerSearch]);

  const selectedCount = selectedQuestionIds.length;

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
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const buildPayload = (): QuestionSetPayload => ({
    name: name.trim(),
    description: description.trim(),
    question_ids: selectedQuestionIds,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Set name is required");
      return;
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
    isCurrentPageFullySelected,
    toggleQuestionSelection,
    toggleCurrentPageQuestions,
    removeSelectedQuestion,
  };
};
