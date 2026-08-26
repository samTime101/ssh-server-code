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
import { Label } from "@/components/ui/label";
import { PenIcon, PlusIcon, TrashIcon } from "lucide-react";
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
    isFormOpen,
    editingTarget,
    name,
    setName,
    icon,
    setIcon,
    status,
    setStatus,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleDelete,
    currentPage,
    pageSize,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    modal,
  } = useManageCategories();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Manage Categories</h1>
          <p className="text-muted-foreground mt-1">Create, edit, or delete categories.</p>
        </div>
        <Button onClick={openCreateForm} className="cursor-pointer">
          <PlusIcon size={16} />
          New Category
        </Button>
      </div>

      <div className="border-border bg-card rounded-md border p-4 shadow-md">
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
                      onClick={() => openEditForm(cat)}
                      disabled={isSubmitting}
                    >
                      <PenIcon size={12} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(cat)}
                      disabled={isSubmitting}
                    >
                      <TrashIcon size={12} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {pagination && (
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
        open={isFormOpen}
        onOpenChange={(open) => !open && closeForm()}
        title={editingTarget ? "Edit Category" : "New Category"}
        contentClassName="sm:max-w-lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="categoryName">Name</Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Icon</Label>
            <IconPicker
              value={icon}
              onChange={setIcon}
              placeholder="Select category icon"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as CategoryStatus)}
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
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !name.trim()}>
              {isSubmitting ? "Saving..." : editingTarget ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
      {modal}
    </div>
  );
};

export default ManageCategoriesPage;
