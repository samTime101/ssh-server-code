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
  fetchUserRoles,
  assignRoleToUser,
  removeRoleFromUser,
  type User,
} from "@/services/admin/user-service";
import { fetchRoles, type Role } from "@/services/admin/role-service";

const EditUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  // User data
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Role management
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (!id || !token) return;
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  const loadUserData = async () => {
    if (!id || !token) return;
    try {
      setLoading(true);
      const userData = await fetchUserById(id, token);
      setUser(userData);
      setUsername(userData.username);
      setEmail(userData.email);
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setIsActive(userData.is_active);

      // Load roles using the user's actual ID (pk), not user_guid
      const [rolesData, userRolesData] = await Promise.all([
        fetchRoles(token),
        fetchUserRoles(userData.id.toString(), token),
      ]);
      setRoles(rolesData);
      setUserRoles(userRolesData);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !token) return toast.error("Missing user ID or token");
    if (!username.trim()) return toast.error("Username is required");
    if (!email.trim()) return toast.error("Email is required");

    try {
      setSaving(true);
      await updateUser(
        id,
        {
          username: username.trim(),
          email: email.trim(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          is_active: isActive,
        },
        token
      );
      toast.success("User updated successfully");
      await loadUserData();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRole = async () => {
    if (!user || !token || !selectedRoleId) {
      return toast.error("Please select a role");
    }

    try {
      setSaving(true);
      await assignRoleToUser(user.id.toString(), selectedRoleId, token);
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

  const handleRemoveRole = async (userRoleId: string) => {
    if (!token) return;

    try {
      setSaving(true);
      await removeRoleFromUser(userRoleId, token);
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
        <p className="text-sm text-gray-600">Manage user details and roles</p>
      </div>

      {/* User Details Form */}
      <form onSubmit={handleSaveChanges} className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">User Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              type="email"
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                disabled={saving}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={isActive ? "active" : "inactive"}>
              <SelectTrigger disabled={saving}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="active"
                  onClick={() => setIsActive(true)}
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="inactive"
                  onClick={() => setIsActive(false)}
                >
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button type="submit" disabled={saving}>
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
            <SelectTrigger className="flex-1" disabled={saving}>
              <SelectValue placeholder="Select a role to assign" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
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
          {userRoles.length === 0 ? (
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded">
              No roles assigned
            </div>
          ) : (
            <div className="space-y-2">
              {userRoles.map((userRole) => (
                <div
                  key={userRole.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                >
                  <span className="text-sm font-medium">
                    {userRole.role_name || userRole.role}
                  </span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveRole(userRole.id)}
                    disabled={saving}
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
