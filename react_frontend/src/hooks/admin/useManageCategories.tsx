import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchCategories, updateCategory, deleteCategory } from "@/services/admin/category-service";
import type { Category } from "@/types/category";

export const useManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data.categories);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (category: Category) => {
    setEditTarget(category);
    setEditName(category.name);
  };

  const closeEditModal = () => {
    setEditTarget(null);
    setEditName("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editName.trim()) return;
    setIsSubmitting(true);
    try {
      await updateCategory(editTarget.id, editName.trim());
      toast.success("Category updated successfully");
      closeEditModal();
      await loadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (
      !confirm(
        `Are you sure you want to delete "${category.name}"? This may affect associated questions.`
      )
    )
      return;
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted successfully");
      await loadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    }
  };

  return {
    categories,
    isLoading,
    editTarget,
    editName,
    setEditName,
    isSubmitting,
    openEditModal,
    closeEditModal,
    handleEditSubmit,
    handleDelete,
  };
};
