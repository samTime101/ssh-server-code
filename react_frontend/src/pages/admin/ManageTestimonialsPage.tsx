import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "@/components/Modal";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import Paginator from "@/components/Paginator";
import { getImageUrl } from "@/config/apiConfig";
import { useManageTestimonials } from "@/hooks/admin/useManageTestimonials";
import { PenIcon, PlusIcon, TrashIcon } from "lucide-react";

const ManageTestimonialsPage = () => {
  const {
    testimonials,
    isLoading,
    isFormOpen,
    editingTestimonial,
    form,
    imageFile,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    updateField,
    setImageFile,
    handleSubmit,
    handleDelete,
    pagination,
    currentPage,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  } = useManageTestimonials();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Manage Testimonials</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage student testimonials shown on the landing page.
          </p>
        </div>

        <Button onClick={openCreateForm} className="cursor-pointer">
          <PlusIcon size={16} />
          New Testimonial
        </Button>
      </div>

      <div className="border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <Table>
          <TableCaption>{isLoading ? "" : `Total testimonials: ${pagination.count}`}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonLoader rows={4} columns={5} />
            ) : testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No testimonials found
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((testimonial) => (
                <TableRow key={testimonial.id} className="text-muted-foreground">
                  <TableCell className="font-semibold">{testimonial.name}</TableCell>
                  <TableCell>{testimonial.specialization}</TableCell>
                  <TableCell className="max-w-xs truncate" title={testimonial.message}>
                    {testimonial.message}
                  </TableCell>
                  <TableCell>
                    {testimonial.image_url ? (
                      <img
                        src={getImageUrl(testimonial.image_url)}
                        alt={testimonial.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs italic">None</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className="bg-primary text-primary-foreground cursor-pointer rounded"
                      onClick={() => openEditForm(testimonial)}
                    >
                      <PenIcon size={12} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(testimonial)}
                    >
                      <TrashIcon size={12} />
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
        title={editingTestimonial ? "Edit Testimonial" : "New Testimonial"}
        contentClassName="sm:max-w-lg overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              value={form.specialization}
              onChange={(e) => updateField("specialization", e.target.value)}
              placeholder="Medical Student"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="image">Photo</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            {editingTestimonial?.image_url && !imageFile && (
              <img
                src={getImageUrl(editingTestimonial.image_url)}
                alt={editingTestimonial.name}
                className="mt-1 h-16 w-16 rounded object-cover"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingTestimonial ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageTestimonialsPage;
