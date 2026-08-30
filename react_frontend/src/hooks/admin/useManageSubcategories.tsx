import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import {
  createSubCategory,
  deleteSubCategory,
  fetchSubcategories,
  updateSubCategory,
} from "@/services/admin/subcategory-service";
import { fetchCategories } from "@/services/admin/category-service";
import type { Category, CategoryStatus, SubCategoryDetail } from "@/types/category";

export const useManageSubcategories = () => {
  const { confirm, modal } = useConfirm();
  const [subcategories, setSubcategories] = useState<SubCategoryDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SubCategoryDetail | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState<CategoryStatus>("pending");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    current_page: 1,
  });

  const loadSubcategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSubcategories(currentPage, pageSize);
      setSubcategories(data.subcategories);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch {
      toast.error("Failed to load subcategories");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories(1, 1000);
      setCategories(data.categories);
    } catch {
      toast.error("Failed to load categories");
    }
  }, []);

  useEffect(() => {
    loadSubcategories();
  }, [loadSubcategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const resetForm = () => {
    setName("");
    setIcon("");
    setStatus("pending");
    setCategoryId("");
    setEditTarget(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditModal = (subcategory: SubCategoryDetail) => {
    setEditTarget(subcategory);
    setName(subcategory.name);
    setIcon(subcategory.icon ?? "");
    setStatus(subcategory.status ?? "pending");
    setCategoryId(subcategory.categoryId);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Subcategory name is required");
      return;
    }
    if (!categoryId) {
      toast.error("Category is required");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editTarget) {
        await updateSubCategory(editTarget.id, name.trim(), categoryId, status, icon);
        toast.success("Subcategory updated successfully");
      } else {
        await createSubCategory(categoryId, name.trim(), icon || undefined);
        toast.success("Subcategory created successfully");
      }
      closeForm();
      await loadSubcategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save subcategory");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (subcategory: SubCategoryDetail) => {
    if (
      !(await confirm(
        `Are you sure you want to delete "${subcategory.name}"? This may affect associated questions.`
      ))
    )
      return;
    try {
      await deleteSubCategory(subcategory.id);
      toast.success("Subcategory deleted successfully");
      if (subcategories.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await loadSubcategories();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete subcategory");
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    subcategories,
    categories,
    isLoading,
    isFormOpen,
    editTarget,
    name,
    setName,
    icon,
    setIcon,
    status,
    setStatus,
    categoryId,
    setCategoryId,
    isSubmitting,
    openCreateForm,
    openEditModal,
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
