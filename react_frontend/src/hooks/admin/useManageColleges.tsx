import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import {
  createCollege,
  deleteCollege,
  fetchColleges,
  updateCollege,
} from "@/services/admin/college-service";
import type { College } from "@/types/college";

const emptyForm = { name: "", city: "", state: "", country: "", postal_code: "" };
type CollegeFormState = typeof emptyForm;

export const useManageColleges = () => {
  const { confirm, modal } = useConfirm();
  const [colleges, setColleges] = useState<College[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);
  const [form, setForm] = useState<CollegeFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const loadColleges = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchColleges(currentPage, pageSize);
      setColleges(data.results);
      setPagination({
        count: data.count,
        total_pages: data.total_pages,
        next: data.next,
        previous: data.previous,
      });
    } catch {
      toast.error("Failed to load colleges");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadColleges();
  }, [loadColleges]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingCollege(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (college: College) => {
    setEditingCollege(college);
    setForm({
      name: college.name,
      city: college.city,
      state: college.state,
      country: college.country,
      postal_code: college.postal_code,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const updateField = <K extends keyof CollegeFormState>(
    field: K,
    value: CollegeFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim() || !form.state.trim() || !form.country.trim()) {
      toast.error("All fields are required");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingCollege) {
        await updateCollege(editingCollege.id, form);
        toast.success("College updated successfully");
      } else {
        await createCollege(form);
        toast.success("College created successfully");
      }
      closeForm();
      await loadColleges();
    } catch {
      toast.error("Failed to save college");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (college: College) => {
    if (!(await confirm(`Are you sure you want to delete "${college.name}"?`))) return;
    try {
      await deleteCollege(college.id);
      toast.success("College deleted successfully");
      if (colleges.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await loadColleges();
      }
    } catch {
      toast.error("Failed to delete college");
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return {
    colleges,
    isLoading,
    isFormOpen,
    editingCollege,
    form,
    isSubmitting,
    pagination,
    currentPage,
    pageSize,
    openCreateForm,
    openEditForm,
    closeForm,
    updateField,
    handleSubmit,
    handleDelete,
    handlePageChange,
    handlePageSizeChange,
    modal,
  };
};
