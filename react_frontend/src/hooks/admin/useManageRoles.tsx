import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import {
  createRole,
  deleteRole,
  fetchRoles,
  updateRole,
} from "@/services/admin/role-service";
import type { Role } from "@/types/role";

export const useManageRoles = () => {
  const { confirm, modal } = useConfirm();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const resetForm = () => {
    setRoleName("");
    setEditingRole(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (role: Role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingRole) {
        await updateRole(editingRole.id, roleName.trim());
        toast.success("Role updated successfully");
      } else {
        await createRole(roleName.trim());
        toast.success("Role created successfully");
      }
      closeForm();
      await loadRoles();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (role: Role) => {
    if (!(await confirm(`Are you sure you want to delete "${role.name}"?`))) return;
    try {
      await deleteRole(role.id);
      toast.success("Role deleted successfully");
      await loadRoles();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete role");
    }
  };

  return {
    roles,
    isLoading,
    isFormOpen,
    editingRole,
    roleName,
    setRoleName,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
    modal,
  };
};
