import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useAddRole } from "@/hooks/admin/useAddRole";

const AddRolePage = () => {
  const { roleName, setRoleName, roles, loading, handleAddRole } = useAddRole();

  return (
    <section className="p-6">
      <h1 className="text-foreground mb-4 text-2xl font-semibold">Add Role</h1>

      <form onSubmit={handleAddRole} className="mb-6 flex gap-3">
        <Input
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Role name"
        />
        <Button type="submit" disabled={loading}>
          Add Role
        </Button>
      </form>

      <h2 className="text-foreground mb-2 text-xl font-medium">Existing roles</h2>
      <div className="border-border bg-card rounded-md border shadow-md">
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
              <TableRow className="text-muted-foreground" key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default AddRolePage;
