import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  fetchSubcategories,
  updateSubCategory,
  deleteSubCategory,
} from "@/services/admin/subcategory-service";
import type { CategoryStatus, SubCategoryDetail } from "@/types/category";

export const useManageSubcategories = () => {
  const [subcategories, setSubcategories] = useState<SubCategoryDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<SubCategoryDetail | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<CategoryStatus>("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSubcategories();
  }, []);

  const loadSubcategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSubcategories();
      setSubcategories(data);
    } catch {
      toast.error("Failed to load subcategories");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (subcategory: SubCategoryDetail) => {
    setEditTarget(subcategory);
    setEditName(subcategory.name);
    setEditStatus(subcategory.status ?? "pending");
  };

  const closeEditModal = () => {
    setEditTarget(null);
    setEditName("");
    setEditStatus("pending");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editName.trim()) return;
    setIsSubmitting(true);
    try {
      await updateSubCategory(editTarget.id, editName.trim(), editTarget.categoryId, editStatus);
      toast.success("Subcategory updated successfully");
      closeEditModal();
      await loadSubcategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update subcategory");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (subcategory: SubCategoryDetail) => {
    if (
      !confirm(
        `Are you sure you want to delete "${subcategory.name}"? This may affect associated questions.`
      )
    )
      return;
    try {
      await deleteSubCategory(subcategory.id);
      toast.success("Subcategory deleted successfully");
      await loadSubcategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete subcategory");
    }
  };

  return {
    subcategories,
    isLoading,
    editTarget,
    editName,
    setEditName,
    editStatus,
    setEditStatus,
    isSubmitting,
    openEditModal,
    closeEditModal,
    handleEditSubmit,
    handleDelete,
  };
};
