import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "@/components/Modal";
import Paginator from "@/components/Paginator";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { PenIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useManageColleges } from "@/hooks/admin/useManageColleges";

const ManageCollegesPage = () => {
  const {
    colleges,
    isLoading,
    isFormOpen,
    editingCollege,
    form,
    isSubmitting,
    pagination,
    currentPage,
    pageSize,
    openCreateForm,
    openEditForm,
    closeForm,
    updateField,
    handleSubmit,
    handleDelete,
    handlePageChange,
    handlePageSizeChange,
    modal,
  } = useManageColleges();

  return (
    <section className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">Manage Colleges</h1>
          <p className="text-muted-foreground text-sm">Create and manage colleges.</p>
        </div>
        <Button onClick={openCreateForm} className="cursor-pointer">
          <PlusIcon size={16} />
          New College
        </Button>
      </div>

      <div className="border-border bg-card rounded-md border shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Postal Code</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonLoader rows={5} columns={6} />
            ) : colleges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-4 text-center">
                  No colleges found
                </TableCell>
              </TableRow>
            ) : (
              colleges.map((college) => (
                <TableRow className="text-muted-foreground" key={college.id}>
                  <TableCell>{college.name}</TableCell>
                  <TableCell>{college.city}</TableCell>
                  <TableCell>{college.state}</TableCell>
                  <TableCell>{college.country}</TableCell>
                  <TableCell>{college.postal_code}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className="bg-primary text-primary-foreground cursor-pointer rounded"
                      onClick={() => openEditForm(college)}
                    >
                      <PenIcon size={14} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(college)}
                    >
                      <TrashIcon size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Paginator
          currentPage={currentPage}
          totalPages={pagination.total_pages}
          pageSize={pageSize}
          totalCount={pagination.count}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          isLoading={isLoading}
        />
      </div>

      <Modal
        open={isFormOpen}
        onOpenChange={(open) => !open && closeForm()}
        title={editingCollege ? "Edit College" : "New College"}
        contentClassName="sm:max-w-lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="College name"
                required
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="City"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                placeholder="State"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="Country"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={form.postal_code}
                onChange={(e) => updateField("postal_code", e.target.value)}
                placeholder="Postal code"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingCollege ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
      {modal}
    </section>
  );
};

export default ManageCollegesPage;
