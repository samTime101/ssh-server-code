import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { fetchRoles, createRole } from "@/services/admin/role-service";

const AddRolePage = () => {
  const { token } = useAuth();
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  const loadRoles = async () => {
    if (!token) return;
    try {
      setLoading(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("You must be logged in");
    if (!roleName.trim()) return toast.error("Role name is required");

    try {
      setLoading(true);
      await createRole(roleName.trim());
      toast.success("Role created");
      setRoleName("");
      // refresh list
      await loadRoles();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Role</h1>

      <form onSubmit={handleAddRole} className="flex gap-3 mb-6">
        <Input 
        value={roleName} 
        onChange={(e) => setRoleName(e.target.value)} 
        placeholder="Role name" />
        <Button type="submit" disabled={loading}>
          Add Role
        </Button>
      </form>

      <h2 className="text-xl font-medium mb-2">Existing roles</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Role Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="p-4 text-center">
                {loading ? "Loading..." : "No roles found"}
              </TableCell>
            </TableRow>
          )}
          {roles.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default AddRolePage;
