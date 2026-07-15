import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createTestimonial,
  deleteTestimonial,
  fetchTestimonials,
  updateTestimonial,
} from "@/services/testimonial-service";
import type { Testimonial, TestimonialFormState } from "@/types/testimonial";

const emptyForm = (): TestimonialFormState => ({
  name: "",
  message: "",
  specialization: "",
});

export const useManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<TestimonialFormState>(emptyForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  const loadTestimonials = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTestimonials(currentPage, pageSize);
      setTestimonials(data.results);
      setPagination({
        count: data.count,
        total_pages: data.total_pages,
        next: data.next,
        previous: data.previous,
      });
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setForm(emptyForm());
    setImageFile(null);
    setEditingTestimonial(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setForm({
      name: testimonial.name,
      message: testimonial.message,
      specialization: testimonial.specialization,
    });
    setImageFile(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const updateField = <K extends keyof TestimonialFormState>(
    field: K,
    value: TestimonialFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = () => {
    const name = form.name.trim();
    const message = form.message.trim();
    const specialization = form.specialization.trim();

    if (!name) {
      toast.error("Name is required");
      return null;
    }
    if (!message) {
      toast.error("Message is required");
      return null;
    }
    if (!specialization) {
      toast.error("Specialization is required");
      return null;
    }

    return { name, message, specialization };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, payload, imageFile);
        toast.success("Testimonial updated successfully");
      } else {
        await createTestimonial(payload, imageFile);
        toast.success("Testimonial created successfully");
      }
      closeForm();
      await loadTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save testimonial");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!window.confirm(`Delete testimonial from "${testimonial.name}"?`)) return;

    try {
      await deleteTestimonial(testimonial.id);
      toast.success("Testimonial deleted successfully");
      await loadTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete testimonial");
    }
  };

  return {
    testimonials,
    isLoading,
    isFormOpen,
    editingTestimonial,
    form,
    imageFile,
    isSubmitting,
    pagination,
    currentPage,
    pageSize,
    openCreateForm,
    openEditForm,
    closeForm,
    updateField,
    setImageFile,
    handleSubmit,
    handleDelete,
    handlePageChange,
    handlePageSizeChange,
  };
};
