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
import { useManageSubcategories } from "@/hooks/admin/useManageSubcategories";
import type { CategoryStatus } from "@/types/category";

const ManageSubcategoriesPage = () => {
  const {
    subcategories,
    categories,
    isLoading,
    isFormOpen,
    editTarget,
    name,
    setName,
    icon,
    setIcon,
    status,
    setStatus,
    categoryId,
    setCategoryId,
    isSubmitting,
    openCreateForm,
    openEditModal,
    closeForm,
    handleSubmit,
    handleDelete,
    currentPage,
    pageSize,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    modal,
  } = useManageSubcategories();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Manage Subcategories</h1>
          <p className="text-muted-foreground mt-1">Create, edit, or delete subcategories.</p>
        </div>
        <Button onClick={openCreateForm} className="cursor-pointer">
          <PlusIcon size={16} />
          New Subcategory
        </Button>
      </div>

      <div className="border-border bg-card rounded-md border p-4 shadow-md">
        <Table>
          <TableCaption>
            {isLoading ? "" : `Total subcategories: ${pagination?.count || subcategories.length}`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
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
                  <TableCell className="font-semibold">
                    <span className="flex items-center gap-2">
                      <CategoryIcon icon={sub.icon} size="sm" />
                      {sub.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={sub.status} />
                  </TableCell>
                  <TableCell>{sub.categoryName}</TableCell>
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
        title={editTarget ? "Edit Subcategory" : "New Subcategory"}
        contentClassName="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {editTarget && (
            <p className="text-muted-foreground text-sm">
              Category: <span className="font-medium">{editTarget.categoryName}</span>
            </p>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="subcategoryName">Name</Label>
            <Input
              id="subcategoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Subcategory name"
              required
              autoFocus
            />
          </div>

          {!editTarget && (
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Icon</Label>
            <IconPicker
              value={icon}
              onChange={setIcon}
              placeholder="Select subcategory icon"
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
            <Button type="submit" disabled={isSubmitting || !name.trim() || !categoryId}>
              {isSubmitting ? "Saving..." : editTarget ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
      {modal}
    </div>
  );
};

export default ManageSubcategoriesPage;
