import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PenIcon, TrashIcon } from "lucide-react";
import Paginator from "@/components/Paginator";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { useManageClients } from "@/hooks/admin/useManageClients";
import { getTenantAccessHost } from "@/config/tenant";
import { Badge } from "@/components/ui/badge";
import ImagePreview from "@/components/ImagePreview";
import type { ClientStatus } from "@/types/client";

const CLIENT_STATUS_CLASSES: Record<ClientStatus, string> = {
  ACTIVE: "border-green-200 bg-green-50 text-green-700",
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  PROVISIONING: "border-blue-200 bg-blue-50 text-blue-700",
  SUSPENDED: "border-orange-200 bg-orange-50 text-orange-700",
  DELETED: "border-red-200 bg-red-50 text-red-700",
};

const ManageClientsPage = () => {
  const {
    filteredClients,
    loading,
    submitting,
    editingId,
    editingClient,
    pagination,
    currentPage,
    pageSize,
    formData,
    searchQuery,
    setFormData,
    setSearchQuery,
    handleEdit,
    handleFileChange,
    handleSubmit,
    handleDelete,
    handlePageChange,
    handlePageSizeChange,
    resetForm,
    modal,
  } = useManageClients();

  const [fileKey, setFileKey] = useState(0);
  const resetFileInputs = () => setFileKey((prev) => prev + 1);
  const subdomainPreview = formData.subdomain.trim()
    ? getTenantAccessHost(formData.subdomain.trim().toLowerCase())
    : null;

  const onReset = () => {
    resetForm();
    resetFileInputs();
  };

  const onSubmit = async (e: React.FormEvent) => {
    const saved = await handleSubmit(e);
    if (saved) resetFileInputs();
  };

  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-foreground text-2xl font-semibold">Manage Clients</h1>
        <p className="text-muted-foreground text-sm">
          Create organization tenants. Each client gets its own subdomain, databases, and an admin
          setup email.
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-card border-border rounded-lg border p-6">
        <h2 className="mb-6 text-lg font-medium">{editingId ? "Edit Client" : "Add Client"}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="organization_name">Organization Name</Label>
            <Input
              id="organization_name"
              value={formData.organization_name}
              onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
              placeholder="Organization name"
              disabled={submitting}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subdomain">Subdomain</Label>
            <Input
              id="subdomain"
              value={formData.subdomain}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subdomain: e.target.value.toLowerCase().replace(/\s+/g, ""),
                })
              }
              placeholder="acme"
              disabled={submitting || (!!editingId && Boolean(editingClient?.subdomain))}
              required
            />
            <p className="text-muted-foreground text-xs">
              {subdomainPreview
                ? `Org will be reached at ${subdomainPreview}`
                : "Lowercase letters, numbers, and hyphens only"}
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Organization admin email"
              disabled={submitting}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pan">PAN</Label>
            <Input
              id="pan"
              value={formData.pan}
              onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
              placeholder="PAN number"
              disabled={submitting}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="registration_number">Registration Number</Label>
            <Input
              id="registration_number"
              value={formData.registration_number}
              onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              placeholder="Registration number"
              disabled={submitting}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phonenumber">Phone Number</Label>
            <Input
              id="phonenumber"
              value={formData.phonenumber}
              onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
              placeholder="Phone number"
              disabled={submitting}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address"
              disabled={submitting}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pan_photo">PAN Photo</Label>
            <Input
              key={`pan-${fileKey}`}
              id="pan_photo"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange("pan_photo", e.target.files?.[0] ?? null)}
              disabled={submitting}
              required={!editingId}
            />
            <ImagePreview
              file={formData.pan_photo}
              existingSrc={editingClient?.pan_photo_url}
              alt="PAN photo preview"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="registration_photo">Registration Photo</Label>
            <Input
              key={`reg-${fileKey}`}
              id="registration_photo"
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange("registration_photo", e.target.files?.[0] ?? null)
              }
              disabled={submitting}
              required={!editingId}
            />
            <ImagePreview
              file={formData.registration_photo}
              existingSrc={editingClient?.registration_photo_url}
              alt="Registration photo preview"
            />
          </div>
        </div>

        {editingClient && (editingClient.database_name || editingClient.mongo_database_name) && (
          <p className="text-muted-foreground mt-4 text-xs">
            SQL: {editingClient.database_name || "—"} · Mongo:{" "}
            {editingClient.mongo_database_name || "—"}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting
              ? editingId
                ? "Saving..."
                : "Provisioning..."
              : editingId
                ? "Update Client"
                : "Add Client"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={onReset} disabled={submitting}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-foreground mb-2 text-xl font-medium">Existing Clients</h2>
        <div className="mb-4">
          <Input
            placeholder="Search by organization, subdomain, email, PAN or registration number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="border-border bg-card rounded-md border shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Subdomain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeletonLoader rows={5} columns={6} />
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-4 text-center">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow className="text-muted-foreground" key={client.id}>
                    <TableCell className="font-medium">{client.organization_name}</TableCell>
                    <TableCell>{client.subdomain || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          CLIENT_STATUS_CLASSES[client.status] ??
                          "border-border bg-muted text-muted-foreground"
                        }
                      >
                        {client.status || "UNKNOWN"}
                      </Badge>
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phonenumber}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        className="bg-primary text-primary-foreground cursor-pointer rounded"
                        onClick={() => handleEdit(client)}
                        disabled={submitting}
                      >
                        <PenIcon size={14} />
                      </Button>
                      <Button
                        className="bg-destructive text-primary-foreground cursor-pointer rounded"
                        onClick={() => handleDelete(client.id)}
                        disabled={submitting}
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
            isLoading={loading}
          />
        </div>
      </div>
      {modal}
    </section>
  );
};

export default ManageClientsPage;
