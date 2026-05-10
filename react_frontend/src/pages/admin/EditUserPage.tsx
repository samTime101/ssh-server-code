import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditUser } from "@/hooks/admin/useEditUser";

const EditUserPage = () => {
  const {
    user,
    roles,
    selectedRoleId,
    setSelectedRoleId,
    loading,
    saving,
    handleInputChange,
    handleSaveChanges,
    handleAddRole,
    handleRemoveRole,
    handleCancel,
  } = useEditUser();

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
        <Button onClick={handleCancel} className="mt-4">
          Go Back
        </Button>
      </section>
    );
  }

  return (
    <section className="max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold">Edit User</h1>
        <p className="text-muted-foreground text-sm">Manage user details and roles</p>
      </div>

      {/* User Details Form */}
      <form
        onSubmit={handleSaveChanges}
        className="bg-card border-border mb-6 rounded-lg border p-6"
      >
        <h2 className="mb-4 text-lg font-medium">User Details</h2>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Username</label>
            <Input
              value={user.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Username"
              disabled={saving}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email Address</label>
            <Input
              value={user.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Email address"
              type="email"
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">First Name</label>
              <Input
                value={user.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                placeholder="First name"
                disabled={saving}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Last Name</label>
              <Input
                value={user.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                placeholder="Last name"
                disabled={saving}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Status</label>
            <Select
              value={user.is_active ? "active" : "inactive"}
              onValueChange={(value) => handleInputChange("is_active", value === "active")}
            >
              <SelectTrigger disabled={saving}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {/* Role Management */}
      <div className="bg-card border-border rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">Role Management</h2>

        {/* Add Role */}
        <div className="mb-6 flex gap-3">
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger className="flex-1" disabled={saving}>
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
          <h3 className="mb-3 text-sm font-medium">Current Roles</h3>
          {user.roles.length === 0 ? (
            <div className="text-muted-foreground bg-muted rounded p-3 text-sm">
              No roles assigned
            </div>
          ) : (
            <div className="space-y-2">
              {roles
                .filter((role) => user.roles.includes(role.name))
                .map((role) => (
                  <div
                    key={role.id}
                    className="bg-muted border-border flex items-center justify-between rounded border p-3"
                  >
                    <span className="text-sm font-medium">{role.name}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveRole(role.id)}
                      disabled={saving || role.name === "USER"}
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
