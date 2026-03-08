import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import {
  fetchSubcategories,
  updateSubCategory,
  deleteSubCategory,
} from "@/services/admin/subcategory-service";
import Modal from "@/components/Modal";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import type { SubCategoryDetail } from "@/types/category";

const ManageSubcategoriesPage = () => {
  const [subcategories, setSubcategories] = useState<SubCategoryDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<SubCategoryDetail | null>(null);
  const [editName, setEditName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadSubcategories();
  }, []);

  const loadSubcategories = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSubcategories();
      setSubcategories(data);
    } catch {
      toast.error("Failed to load subcategories");
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (subcategory: SubCategoryDetail) => {
    setEditTarget(subcategory);
    setEditName(subcategory.name);
  };

  const closeEditModal = () => {
    setEditTarget(null);
    setEditName("");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !editName.trim()) return;
    setIsSubmitting(true);
    try {
      await updateSubCategory(editTarget.id, editName.trim(), editTarget.categoryId);
      toast.success("Subcategory updated successfully");
      closeEditModal();
      await loadSubcategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update subcategory");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (subcategory: SubCategoryDetail) => {
    if (
      !confirm(
        `Are you sure you want to delete "${subcategory.name}"? This may affect associated questions.`
      )
    )
      return;
    try {
      await deleteSubCategory(subcategory.id);
      toast.success("Subcategory deleted successfully");
      await loadSubcategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete subcategory");
    }
  };

  return (
    <div>
      <h1 className="text-foreground text-2xl font-bold">Manage Subcategories</h1>
      <p className="text-muted-foreground mt-1">View, edit, or delete existing subcategories.</p>

      <div className="border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <Table>
          <TableCaption>
            {isLoading ? "" : `Total subcategories: ${subcategories.length}`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonLoader rows={5} columns={4} />
            ) : subcategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No subcategories found
                </TableCell>
              </TableRow>
            ) : (
              subcategories.map((sub) => (
                <TableRow key={sub.id} className="text-muted-foreground">
                  <TableCell className="font-semibold">{sub.name}</TableCell>
                  <TableCell>{sub.categoryName}</TableCell>
                  <TableCell>{sub.question_count ?? 0}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className="bg-primary text-primary-foreground cursor-pointer rounded"
                      onClick={() => openEditModal(sub)}
                    >
                      <PenIcon size={12} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(sub)}
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
        title="Edit Subcategory"
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
          {editTarget && (
            <p className="text-muted-foreground text-sm">
              Category: <span className="font-medium">{editTarget.categoryName}</span>
            </p>
          )}
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Subcategory name"
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

export default ManageSubcategoriesPage;
