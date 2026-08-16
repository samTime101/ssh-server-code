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
import { getImageUrl } from "@/config/apiConfig";

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

  const onReset = () => {
    resetForm();
    resetFileInputs();
  };

  const onSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    resetFileInputs();
  };

  return (
    <section className="space-y-6 p-6">
      <div>
        <h1 className="text-foreground text-2xl font-semibold">Manage Clients</h1>
        <p className="text-muted-foreground text-sm">Create and manage organization clients</p>
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email address"
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
          </div>
        </div>

        {editingClient && (
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {editingClient.pan_photo_url && (
              <a
                href={getImageUrl(editingClient.pan_photo_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline"
              >
                View existing PAN photo
              </a>
            )}
            {editingClient.registration_photo_url && (
              <a
                href={getImageUrl(editingClient.registration_photo_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline"
              >
                View existing registration photo
              </a>
            )}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : editingId ? "Update Client" : "Add Client"}
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
            placeholder="Search clients by organization, email, PAN or registration number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="border-border bg-card rounded-md border shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>PAN</TableHead>
                <TableHead>Registration No.</TableHead>
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
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.pan}</TableCell>
                    <TableCell>{client.registration_number}</TableCell>
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
