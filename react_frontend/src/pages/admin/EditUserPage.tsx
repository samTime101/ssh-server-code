import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchUserById,
  updateUser,
  assignRoleToUser,
  removeRoleFromUser,
} from "@/services/admin/user-service";
import type { User } from "@/types/user";
import { fetchRoles } from "@/services/admin/role-service";
import type { Role } from "@/types/role";

const EditUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);


  const isSelfEditing = currentUser && user && currentUser.id === user.id;

  useEffect(() => {
    if (!id || !token) return;
    loadUserData();
  }, [id, token]);

  const loadUserData = async () => {
    if (!id || !token) return;
    try {
      setLoading(true);
      const [userData, rolesData] = await Promise.all([
        fetchUserById(id),
        fetchRoles(),
      ]);
      setUser(userData);
      setRoles(rolesData);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !token || !user) return toast.error("Missing user ID or token");
    if (!user.username.trim()) return toast.error("Username is required");
    if (!user.email.trim()) return toast.error("Email is required");

    try {
      setSaving(true);
      await updateUser(id, {
        username: user.username.trim(),
        email: user.email.trim(),
        first_name: user.first_name.trim(),
        last_name: user.last_name.trim(),
        is_active: user.is_active,
      });
      toast.success("User updated successfully");
      await loadUserData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof User, value: string | boolean) => {
    if (!user) return;
    setUser({ ...user, [field]: value });
  };

  const handleAddRole = async () => {
    if (!user || !token || !selectedRoleId) {
      return toast.error("Please select a role");
    }
    if (user.roles.includes(selectedRoleId)) {
      return toast.error("User already has this role");
    }
    try {
      setSaving(true);
      await assignRoleToUser(user.user_guid || user.id.toString(), selectedRoleId);
      toast.success("Role assigned successfully");
      setSelectedRoleId("");
      await loadUserData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to assign role");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!user || !token) return;
    // Find the user-role relation ID (if needed) or use a backend endpoint that removes by user+role
    try {
      setSaving(true);
      // You may need to adjust this if your backend expects a user-role ID
      // Here, assuming removeRoleFromUser can take userId and roleName
      await removeRoleFromUser(user.user_guid || user.id.toString(), roleId);
      toast.success("Role removed successfully");
      await loadUserData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to remove role");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="p-6">
        <div className="text-center">Loading user data...</div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="p-6">
        <div className="text-center">User not found</div>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </section>
    );
  }

  return (
    
    <section className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Edit User</h1>
        {isSelfEditing && (
          <div className="mt-2 text-sm text-red-600">
            You cannot Edit your own roles while logged in.
          </div>
        )
        }
        <p className="text-sm text-gray-600">Manage user details and roles</p>
      </div>

      {/* User Details Form */}
      <form onSubmit={handleSaveChanges} className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">User Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <Input
              value={user.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Username"
              disabled={saving || isSelfEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              value={user.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Email address"
              type="email"
              disabled={saving || isSelfEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <Input
                value={user.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                placeholder="First name"
                disabled={saving || isSelfEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <Input
                value={user.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                placeholder="Last name"
                disabled={saving || isSelfEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={user.is_active ? "active" : "inactive"}>
              <SelectTrigger disabled={saving || isSelfEditing}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="active"
                  onClick={() => handleInputChange("is_active", true)}
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="inactive"
                  onClick={() => handleInputChange("is_active", false)}
                >
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button type="submit" disabled={saving || isSelfEditing}>
            {saving ? "Saving..." : "Save Changes"}

          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Role Management */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-medium mb-4">Role Management</h2>

        {/* Add Role */}
        <div className="mb-6 flex gap-3">
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger className="flex-1" disabled={saving || isSelfEditing}>
              <SelectValue placeholder="Select a role to assign" />
            </SelectTrigger>
            <SelectContent>
              {roles
                .filter((role) => !user.roles.includes(role.name))
                .map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddRole} disabled={saving || !selectedRoleId}>
            Add Role
          </Button>
        </div>

        {/* Current Roles */}
        <div>
          <h3 className="text-sm font-medium mb-3">Current Roles</h3>
          {user.roles.length === 0 ? (
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
              No roles assigned
            </div>
          ) : (
            // DISABLE REMOVE BUTTON FOR EDITING OWN USER TO AVOID LOCKING YOURSELF OUT
            <div className="space-y-2">
              {roles.filter((role) => user.roles.includes(role.name)).map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                >
                  <span className="text-sm font-medium">{role.name}</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveRole(role.id)}
                    disabled={saving || role.name === "USER" || isSelfEditing}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditUserPage;