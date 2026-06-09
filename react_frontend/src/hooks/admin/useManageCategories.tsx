import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchCategories, updateCategory, deleteCategory } from "@/services/admin/category-service";
import type { Category, CategoryStatus } from "@/types/category";

export const useManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<CategoryStatus>("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    current_page: 1,
  });

  useEffect(() => {
    loadCategories();
  }, [currentPage, pageSize]);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCategories(currentPage, pageSize);
      setCategories(data.categories);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (category: Category) => {
    setEditTarget(category);
    setEditName(category.name);
    setEditStatus(category.status ?? "pending");
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
      await updateCategory(editTarget.id, editName.trim(), editStatus);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    categories,
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
    currentPage,
    pageSize,
    pagination,
    handlePageChange,
    handlePageSizeChange,
  };
};
