import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/Modal";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import Paginator from "@/components/Paginator";
import { getImageUrl } from "@/config/apiConfig";
import { useManageSubscriptions } from "@/hooks/admin/useManageSubscriptions";
import { PenIcon, PlusIcon, TrashIcon } from "lucide-react";

const ManageSubscriptionsPage = () => {
  const {
    subscriptions,
    isLoading,
    isFormOpen,
    editingSubscription,
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
    modal,
  } = useManageSubscriptions();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Manage Subscriptions</h1>
          <p className="text-muted-foreground mt-1">Create and manage subscription plans.</p>
        </div>

        <Button onClick={openCreateForm} className="cursor-pointer">
          <PlusIcon size={16} />
          New Plan
        </Button>
      </div>

      <div className="border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <Table>
          <TableCaption>{isLoading ? "" : `Total plans: ${pagination.count}`}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Months</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonLoader rows={4} columns={5} />
            ) : subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No subscription plans found
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((plan) => (
                <TableRow key={plan.id} className="text-muted-foreground">
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-3">
                      {plan.image_url && (
                        <img
                          src={getImageUrl(plan.image_url)}
                          alt={plan.plan_name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      )}
                      <span>{plan.plan_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{plan.price}</TableCell>
                  <TableCell>{plan.number_of_months}</TableCell>
                  <TableCell>
                    <Badge variant={plan.status ? "default" : "secondary"}>
                      {plan.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className="bg-primary text-primary-foreground cursor-pointer rounded"
                      onClick={() => openEditForm(plan)}
                    >
                      <PenIcon size={12} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(plan)}
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
        title={editingSubscription ? "Edit Subscription" : "New Subscription"}
        contentClassName="sm:max-w-lg overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="plan_name">Plan name</Label>
            <Input
              id="plan_name"
              value={form.plan_name}
              onChange={(e) => updateField("plan_name", e.target.value)}
              placeholder="6 Months"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Plan description"
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="999.00"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="number_of_months">Months</Label>
              <Input
                id="number_of_months"
                type="number"
                min="1"
                step="1"
                value={form.number_of_months}
                onChange={(e) => updateField("number_of_months", e.target.value)}
                placeholder="6"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="image_url">Plan image</Label>
            <Input
              id="image_url"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            {editingSubscription?.image_url && !imageFile && (
              <img
                src={getImageUrl(editingSubscription.image_url)}
                alt={editingSubscription.plan_name}
                className="mt-1 h-16 w-16 rounded object-cover"
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="status"
              checked={form.status}
              onCheckedChange={(checked) => updateField("status", checked === true)}
            />
            <Label htmlFor="status">Active plan</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingSubscription ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
      {modal}
    </div>
  );
};

export default ManageSubscriptionsPage;
