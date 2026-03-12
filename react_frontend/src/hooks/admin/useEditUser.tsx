import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchUserById,
  updateUser,
  assignRoleToUser,
  removeRoleFromUser,
} from "@/services/admin/user-service";
import { fetchRoles } from "@/services/admin/role-service";
import type { User } from "@/types/user";
import type { Role } from "@/types/role";

export const useEditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id || !token) return;
    loadUserData();
  }, [id, token]);

  const loadUserData = async () => {
    if (!id || !token) return;
    setLoading(true);
    try {
      const [userData, rolesData] = await Promise.all([fetchUserById(id), fetchRoles()]);
      setUser(userData);
      setRoles(rolesData);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof User, value: string | boolean) => {
    if (!user) return;
    setUser({ ...user, [field]: value });
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !token || !user) return toast.error("Missing user ID or token");
    if (!user.username.trim()) return toast.error("Username is required");
    if (!user.email.trim()) return toast.error("Email is required");
    setSaving(true);
    try {
      await updateUser(id, {
        username: user.username.trim(),
        email: user.email.trim(),
        first_name: user.first_name.trim(),
        last_name: user.last_name.trim(),
        is_active: user.is_active,
      });
      toast.success("User updated successfully");
      await loadUserData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRole = async () => {
    if (!user || !token || !selectedRoleId) return toast.error("Please select a role");
    if (user.roles.includes(selectedRoleId)) return toast.error("User already has this role");
    setSaving(true);
    try {
      await assignRoleToUser(user.user_guid || user.id.toString(), selectedRoleId);
      toast.success("Role assigned successfully");
      setSelectedRoleId("");
      await loadUserData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to assign role");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!user || !token) return;
    setSaving(true);
    try {
      await removeRoleFromUser(user.user_guid || user.id.toString(), roleId);
      toast.success("Role removed successfully");
      await loadUserData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to remove role");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return {
    user,
    roles,
    selectedRoleId,
    setSelectedRoleId,
    loading,
    saving,
    handleInputChange,
    handleSaveChanges,
    handleAddRole,
    handleRemoveRole,
    handleCancel,
  };
};
