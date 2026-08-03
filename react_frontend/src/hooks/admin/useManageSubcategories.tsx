import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import {
  fetchSubcategories,
  updateSubCategory,
  deleteSubCategory,
} from "@/services/admin/subcategory-service";
import type { CategoryStatus, SubCategoryDetail } from "@/types/category";

export const useManageSubcategories = () => {
  const { confirm, modal } = useConfirm();
  const [subcategories, setSubcategories] = useState<SubCategoryDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<SubCategoryDetail | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
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
    loadSubcategories();
  }, [currentPage, pageSize]);

  const loadSubcategories = async () => {
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
  };

  const openEditModal = (subcategory: SubCategoryDetail) => {
    setEditTarget(subcategory);
    setEditName(subcategory.name);
    setEditIcon(subcategory.icon ?? "");
    setEditStatus(subcategory.status ?? "pending");
  };

  const closeEditModal = () => {
    setEditTarget(null);
    setEditName("");
    setEditIcon("");
    setEditStatus("pending");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editName.trim()) return;
    setIsSubmitting(true);
    try {
      await updateSubCategory(
        editTarget.id,
        editName.trim(),
        editTarget.categoryId,
        editStatus,
        editIcon
      );
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    subcategories,
    isLoading,
    editTarget,
    editName,
    setEditName,
    editIcon,
    setEditIcon,
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
    modal,
  };
};
