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
import { fetchColleges, createCollege, deleteCollege } from "@/services/admin/college-service";
import type { College } from "@/types/college";
import { toast } from "sonner";
import { PenIcon, TrashIcon } from "lucide-react";

const AddCollegePage = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      const data = await fetchColleges();
      setColleges(data);
    } catch (error) {
      toast.error("Failed to load colleges");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCollege(formData);
      toast.success("College created successfully");
      resetForm();
      loadColleges();
    } catch (error) {
      toast.error("Failed to create college");
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

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Add College</h1>

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
        <Button type="submit">Add College</Button>
      </form>

      <h2 className="mb-2 text-xl font-medium">Existing colleges</h2>
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
          {colleges.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="p-4 text-center">
                {loading ? "Loading..." : "No colleges found"}
              </TableCell>
            </TableRow>
          )}
          {colleges.map((college) => (
            <TableRow key={college.id}>
              <TableCell>{college.name}</TableCell>
              <TableCell>{college.city}</TableCell>
              <TableCell>{college.state}</TableCell>
              <TableCell>{college.country}</TableCell>
              <TableCell>{college.postal_code}</TableCell>
              <TableCell className="flex gap-2">
                <Button className="btn-edit cursor-pointer rounded bg-blue-500 text-white">
                  <PenIcon size={12} />
                </Button>
                <Button
                  className="btn-delete cursor-pointer rounded bg-red-500 text-white"
                  onClick={() => handleDelete(college.id)}
                >
                  <TrashIcon size={12} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default AddCollegePage;
