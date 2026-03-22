import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { fetchRoles, createRole } from "@/services/admin/role-service";

export const useAddRole = () => {
  const { token } = useAuth();
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  const loadRoles = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, [token]);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("You must be logged in");
    if (!roleName.trim()) return toast.error("Role name is required");
    setLoading(true);
    try {
      await createRole(roleName.trim());
      toast.success("Role created");
      setRoleName("");
      await loadRoles();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return { roleName, setRoleName, roles, loading, handleAddRole };
};
