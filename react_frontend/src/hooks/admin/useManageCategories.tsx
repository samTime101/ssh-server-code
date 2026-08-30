import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/services/admin/category-service";
import type { Category, CategoryStatus } from "@/types/category";

export const useManageCategories = () => {
  const { confirm, modal } = useConfirm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState<CategoryStatus>("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    current_page: 1,
  });

  const loadCategories = useCallback(async () => {
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
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetForm = () => {
    setName("");
    setIcon("");
    setStatus("pending");
    setEditingTarget(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (category: Category) => {
    setEditingTarget(category);
    setName(category.name);
    setIcon(category.icon ?? "");
    setStatus(category.status ?? "pending");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingTarget) {
        await updateCategory(editingTarget.id, name.trim(), status, icon);
        toast.success("Category updated successfully");
      } else {
        await createCategory(name.trim(), icon || undefined);
        toast.success("Category created successfully");
      }
      closeForm();
      await loadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (
      !(await confirm(
        `Are you sure you want to delete "${category.name}"? This may affect associated questions.`
      ))
    )
      return;
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted successfully");
      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await loadCategories();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    categories,
    isLoading,
    isFormOpen,
    editingTarget,
    name,
    setName,
    icon,
    setIcon,
    status,
    setStatus,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
    currentPage,
    pageSize,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    modal,
  };
};
