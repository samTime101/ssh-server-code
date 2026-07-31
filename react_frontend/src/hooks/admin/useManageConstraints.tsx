import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import {
  createConstraint,
  deleteConstraint,
  fetchConstraints,
  updateConstraint,
} from "@/services/admin/constraint-service";
import { fetchCategories } from "@/services/admin/category-service";
import type { Category } from "@/types/category";
import type { Constraint, ConstraintPayload, ConstraintRule } from "@/types/constraint";

type RuleDraft = {
  categoryId: string;
  count: string;
};

const emptyRule = (): RuleDraft => ({ categoryId: "", count: "" });

export const useManageConstraints = () => {
  const { confirm, modal } = useConfirm();
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConstraint, setEditingConstraint] = useState<Constraint | null>(null);
  const [name, setName] = useState("");
  const [rules, setRules] = useState<RuleDraft[]>([emptyRule()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadConstraints();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.categories);
      } catch {
        toast.error("Failed to load categories");
      }
    };

    loadCategories();
  }, []);

  const loadConstraints = async () => {
    setIsLoading(true);
    try {
      const data = await fetchConstraints();
      setConstraints(data.constraints);
    } catch {
      toast.error("Failed to load constraints");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setRules([emptyRule()]);
    setEditingConstraint(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (constraint: Constraint) => {
    setEditingConstraint(constraint);
    setName(constraint.name);
    setRules(
      constraint.rules.length
        ? constraint.rules.map((rule) => ({
            categoryId: rule.categoryId,
            count: String(rule.count),
          }))
        : [emptyRule()]
    );
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const addRule = () => {
    setRules((prev) => [...prev, emptyRule()]);
  };

  const updateRule = (index: number, next: Partial<RuleDraft>) => {
    setRules((prev) => prev.map((rule, i) => (i === index ? { ...rule, ...next } : rule)));
  };

  const removeRule = (index: number) => {
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  const normalizedRules: ConstraintRule[] = useMemo(() => {
    return rules
      .map((rule) => ({
        categoryId: rule.categoryId.trim(),
        count: Number(rule.count),
      }))
      .filter((rule) => Boolean(rule.categoryId) && Number.isFinite(rule.count) && rule.count > 0);
  }, [rules]);

  const buildPayload = (): ConstraintPayload | null => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Constraint name is required");
      return null;
    }

    if (normalizedRules.length === 0) {
      toast.error("Add at least one rule");
      return null;
    }

    const seen = new Set<string>();
    for (const rule of normalizedRules) {
      if (seen.has(rule.categoryId)) {
        toast.error("Duplicate categories are not allowed");
        return null;
      }
      seen.add(rule.categoryId);
    }

    return {
      name: trimmedName,
      rules: normalizedRules.map((rule) => ({
        category: rule.categoryId,
        count: rule.count,
      })),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      if (editingConstraint) {
        await updateConstraint(editingConstraint.id, payload);
        toast.success("Constraint updated successfully");
      } else {
        await createConstraint(payload);
        toast.success("Constraint created successfully");
      }
      closeForm();
      await loadConstraints();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save constraint");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (constraint: Constraint) => {
    if (!(await confirm(`Are you sure you want to delete the constraint "${constraint.name}"?`)))
      return;

    try {
      await deleteConstraint(constraint.id);
      toast.success("Constraint deleted successfully");
      await loadConstraints();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete constraint");
    }
  };

  return {
    constraints,
    categories,
    isLoading,
    isFormOpen,
    editingConstraint,
    name,
    setName,
    rules,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    addRule,
    updateRule,
    removeRule,
    handleSubmit,
    handleDelete,
    modal,
  };
};
