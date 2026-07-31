import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import {
  fetchColleges,
  createCollege,
  deleteCollege,
  updateCollege,
} from "@/services/admin/college-service";
import type { College } from "@/types/college";

const emptyForm = { name: "", city: "", state: "", country: "", postal_code: "" };

export const useAddCollege = () => {
  const { confirm, modal } = useConfirm();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadColleges();
  }, [currentPage, pageSize]);

  const loadColleges = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleEdit = (college: College) => {
    setFormData({
      name: college.name,
      city: college.city,
      state: college.state,
      country: college.country,
      postal_code: college.postal_code,
    });
    setEditingId(college.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCollege(editingId, formData);
        toast.success("College updated successfully");
      } else {
        await createCollege(formData);
        toast.success("College created successfully");
      }
      resetForm();
      loadColleges();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!(await confirm("Are you sure you want to delete this college?"))) return;
    try {
      await deleteCollege(id);
      toast.success("College deleted successfully");
      if (colleges.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        loadColleges();
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

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  return {
    colleges,
    loading,
    editingId,
    pagination,
    currentPage,
    pageSize,
    formData,
    setFormData,
    handleEdit,
    handleSubmit,
    handleDelete,
    handlePageChange,
    handlePageSizeChange,
    resetForm,
    modal,
  };
};
