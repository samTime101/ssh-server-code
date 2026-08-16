import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
} from "@/services/admin/client-service";
import type { Client, ClientFormState } from "@/types/client";

const emptyForm: ClientFormState = {
  organization_name: "",
  address: "",
  pan: "",
  registration_number: "",
  phonenumber: "",
  email: "",
  pan_photo: null,
  registration_photo: null,
};

const buildFormData = (form: ClientFormState): FormData => {
  const formData = new FormData();
  formData.append("organization_name", form.organization_name.trim());
  formData.append("address", form.address.trim());
  formData.append("pan", form.pan.trim());
  formData.append("registration_number", form.registration_number.trim());
  formData.append("phonenumber", form.phonenumber.trim());
  formData.append("email", form.email.trim());
  if (form.pan_photo) formData.append("pan_photo", form.pan_photo);
  if (form.registration_photo) formData.append("registration_photo", form.registration_photo);
  return formData;
};

const validateClientForm = (form: ClientFormState, isEditing: boolean): string | null => {
  if (!form.organization_name.trim()) return "Organization name is required";
  if (!form.address.trim()) return "Address is required";
  if (!form.pan.trim()) return "PAN is required";
  if (!form.registration_number.trim()) return "Registration number is required";
  if (!form.phonenumber.trim()) return "Phone number is required";
  if (!form.email.trim()) return "Email is required";
  if (!isEditing && !form.registration_photo) return "Registration photo is required";
  return null;
};

export const useManageClients = () => {
  const { confirm, modal } = useConfirm();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [formData, setFormData] = useState<ClientFormState>(emptyForm);
  const [searchQuery, setSearchQuery] = useState("");

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchClients(currentPage, pageSize);
      setClients(data.results);
      setPagination({
        count: data.count,
        total_pages: data.total_pages,
        next: data.next,
        previous: data.previous,
      });
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setEditingClient(client);
    setFormData({
      organization_name: client.organization_name,
      address: client.address,
      pan: client.pan,
      registration_number: client.registration_number,
      phonenumber: client.phonenumber,
      email: client.email,
      pan_photo: null,
      registration_photo: null,
    });
  };

  const handleFileChange = (field: "pan_photo" | "registration_photo", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setEditingClient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateClientForm(formData, !!editingId);
    if (validationError) return toast.error(validationError);

    setSubmitting(true);
    try {
      const payload = buildFormData(formData);
      if (editingId) {
        await updateClient(editingId, payload);
        toast.success("Client updated successfully");
      } else {
        await createClient(payload);
        toast.success("Client created successfully");
      }
      resetForm();
      loadClients();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save client");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!(await confirm("Are you sure you want to delete this client?"))) return;
    try {
      await deleteClient(id);
      toast.success("Client deleted successfully");
      if (clients.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        loadClients();
      }
    } catch {
      toast.error("Failed to delete client");
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const filteredClients = clients.filter((client) =>
    `${client.organization_name} ${client.email} ${client.pan} ${client.registration_number}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return {
    clients,
    filteredClients,
    loading,
    submitting,
    editingId,
    editingClient,
    pagination,
    currentPage,
    pageSize,
    formData,
    searchQuery,
    setFormData,
    setSearchQuery,
    handleEdit,
    handleFileChange,
    handleSubmit,
    handleDelete,
    handlePageChange,
    handlePageSizeChange,
    resetForm,
    modal,
  };
};
