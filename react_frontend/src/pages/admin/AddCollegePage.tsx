import { useState, useEffect } from "react";
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
import {
  fetchColleges,
  createCollege,
  deleteCollege,
  updateCollege,
} from "@/services/admin/college-service";
import type { College } from "@/types/college";
import { toast } from "sonner";
import { PenIcon, TrashIcon } from "lucide-react";
import Paginator from "@/components/Paginator";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";

const AddCollegePage = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  useEffect(() => {
    loadColleges();
  }, [currentPage, pageSize]);

  const loadColleges = async () => {
    setLoading(true);
    try {
      const data = await fetchColleges(currentPage, pageSize);
      setColleges(data.results);
      setPagination({
        count: data.count,
        total_pages: data.total_pages,
        next: data.next,
        previous: data.previous,
      });
    } catch (error) {
      toast.error("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (college: College) => {
    setFormData({
      name: college.name,
      city: college.city,
      state: college.state,
      country: college.country,
      postal_code: college.postal_code,
    });
    setEditingId(college.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateCollege(editingId, formData);
        toast.success("College updated successfully");
      } else {
        await createCollege(formData);
        toast.success("College created successfully");
      }
      resetForm();
      loadColleges();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this college?")) {
      try {
        await deleteCollege(id);
        toast.success("College deleted successfully");
        loadColleges();
      } catch (error) {
        toast.error("Failed to delete college");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    });
    setEditingId(null);
  };

  return (
    <section className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-foreground">{editingId ? "Edit College" : "Add College"}</h1>

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

      <h2 className="mb-2 text-xl font-medium text-foreground">Existing colleges</h2>
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
