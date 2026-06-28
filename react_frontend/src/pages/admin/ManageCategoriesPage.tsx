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
import CategoryIcon from "@/components/CategoryIcon";
import IconPicker from "@/components/IconPicker";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import StatusBadge from "@/components/StatusBadge";
import Paginator from "@/components/Paginator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useManageCategories } from "@/hooks/admin/useManageCategories";
import type { CategoryStatus } from "@/types/category";

const ManageCategoriesPage = () => {
  const {
    categories,
    isLoading,
    editTarget,
    editName,
    setEditName,
    editIcon,
    setEditIcon,
    editStatus,
    setEditStatus,
    isSubmitting,
    openEditModal,
    closeEditModal,
    handleEditSubmit,
    handleDelete,
    currentPage,
    pageSize,
    pagination,
    handlePageChange,
    handlePageSizeChange,
  } = useManageCategories();

  return (
    <div>
      <h1 className="text-foreground text-2xl font-bold">Manage Categories</h1>
      <p className="text-muted-foreground mt-1">View, edit, or delete existing categories.</p>

      <div className="border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <Table>
          <TableCaption>
            {isLoading ? "" : `Total categories: ${pagination?.count || categories.length}`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonLoader rows={4} columns={3} />
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id} className="text-muted-foreground">
                  <TableCell className="font-semibold">
                    <span className="flex items-center gap-2">
                      <CategoryIcon icon={cat.icon} size="sm" />
                      {cat.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={cat.status} />
                  </TableCell>
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

        {pagination && pagination.total_pages > 1 && (
          <Paginator
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            pageSize={pageSize}
            totalCount={pagination.count}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
          />
        )}
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
          <div>
            <p className="text-muted-foreground mb-2 text-sm">Icon</p>
            <IconPicker
              value={editIcon}
              onChange={setEditIcon}
              placeholder="Select category icon"
            />
          </div>
          <Select
            value={editStatus}
            onValueChange={(value) => setEditStatus(value as CategoryStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
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
