import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenIcon, TrashIcon } from "lucide-react";
import Modal from "@/components/Modal";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { useManageCategories } from "@/hooks/admin/useManageCategories";

const ManageCategoriesPage = () => {
  const {
    categories,
    isLoading,
    editTarget,
    editName,
    setEditName,
    isSubmitting,
    openEditModal,
    closeEditModal,
    handleEditSubmit,
    handleDelete,
  } = useManageCategories();

  return (
    <div>
      <h1 className="text-foreground text-2xl font-bold">Manage Categories</h1>
      <p className="text-muted-foreground mt-1">View, edit, or delete existing categories.</p>

      <div className="border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <Table>
          <TableCaption>{isLoading ? "" : `Total categories: ${categories.length}`}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Subcategories</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonLoader rows={4} columns={4} />
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id} className="text-muted-foreground">
                  <TableCell className="font-semibold">{cat.name}</TableCell>
                  <TableCell>{cat.sub_categories?.length ?? 0}</TableCell>
                  <TableCell>{cat.question_count ?? 0}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className="bg-primary text-primary-foreground cursor-pointer rounded"
                      onClick={() => openEditModal(cat)}
                    >
                      <PenIcon size={12} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(cat)}
                    >
                      <TrashIcon size={12} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={!!editTarget}
        onOpenChange={(open) => !open && closeEditModal()}
        title="Edit Category"
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Category name"
            required
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !editName.trim()}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategoriesPage;
