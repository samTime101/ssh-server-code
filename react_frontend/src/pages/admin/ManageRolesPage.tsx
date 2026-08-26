import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "@/components/Modal";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { PenIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useManageRoles } from "@/hooks/admin/useManageRoles";

const ManageRolesPage = () => {
  const {
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
  } = useManageRoles();

  return (
    <section className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">Manage Roles</h1>
          <p className="text-muted-foreground text-sm">Create and manage user roles.</p>
        </div>
        <Button onClick={openCreateForm} className="cursor-pointer">
          <PlusIcon size={16} />
          New Role
        </Button>
      </div>

      <div className="border-border bg-card rounded-md border shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonLoader rows={4} columns={2} />
            ) : roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="p-4 text-center">
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              roles.map((role) => (
                <TableRow className="text-muted-foreground" key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className="bg-primary text-primary-foreground cursor-pointer rounded"
                      onClick={() => openEditForm(role)}
                      disabled={isSubmitting}
                    >
                      <PenIcon size={14} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(role)}
                      disabled={isSubmitting}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={isFormOpen}
        onOpenChange={(open) => !open && closeForm()}
        title={editingRole ? "Edit Role" : "New Role"}
        contentClassName="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Role name"
            autoFocus
            required
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !roleName.trim()}>
              {isSubmitting ? "Saving..." : editingRole ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
      {modal}
    </section>
  );
};

export default ManageRolesPage;
