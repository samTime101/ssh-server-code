import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAddCollege } from "@/hooks/admin/useAddCollege";

const AddCollegePage = () => {
  const {
    colleges,
    loading,
    editingId,
    pagination,
    currentPage,
    pageSize,
    formData,
    setFormData,
    handleEdit,
    handleSubmit,
    handleDelete,
    handlePageChange,
    handlePageSizeChange,
    resetForm,
  } = useAddCollege();

  return (
    <section className="space-y-6 p-6">
      <h1 className="text-foreground text-2xl font-semibold">
        {editingId ? "Edit College" : "Add College"}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          required
        />
        <Input
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="City"
          required
        />
        <Input
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          placeholder="State"
          required
        />
        <Input
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          placeholder="Country"
          required
        />
        <Input
          value={formData.postal_code}
          onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
          placeholder="Postal Code"
          required
        />
        <div className="flex gap-2">
          <Button type="submit">{editingId ? "Update College" : "Add College"}</Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <h2 className="text-foreground mb-2 text-xl font-medium">Existing colleges</h2>
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
            {loading ? (
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
                      onClick={() => handleEdit(college)}
                    >
                      <PenIcon size={14} />
                    </Button>
                    <Button
                      className="bg-destructive text-primary-foreground cursor-pointer rounded"
                      onClick={() => handleDelete(college.id)}
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
    </section>
  );
};

export default AddCollegePage;
