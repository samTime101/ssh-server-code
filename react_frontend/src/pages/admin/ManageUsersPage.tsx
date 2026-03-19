import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PenIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Paginator from "@/components/Paginator";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import { useManageUsers } from "@/hooks/admin/useManageUsers";
import Modal from "@/components/Modal";
import SignupForm from "@/components/SignupForm";
const ManageUsersPage = () => {
  const {
    filteredUsers,
    pagination,
    currentPage,
    pageSize,
    isLoading,
    searchQuery,
    isSelf,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleDeleteUser,
    handleEditUser,
    fetchUsers    
  } = useManageUsers();

  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <div>
      <div className="manage-users-header">
        <h1 className="manage-users-title text-foreground text-2xl font-bold">Manage Users</h1>
      </div>
        <Button
          onClick={() => setIsSignupModalOpen(true)}
          className="bg-primary text-primary-foreground"
        >
          Add New User
        </Button>      
      <div className="manage-users-content text-muted-foreground mt-1">
        <p>This is where admin can manage users.</p>
      </div>
      <div className="manage-users-main-content border-border bg-card mt-4 rounded-md border p-4 shadow-md">
        <div className="users-search-section">
          <Input
            placeholder="Search users by name or email"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="users-list-section mt-4">
          <Table>
            <TableCaption>{isLoading ? "" : `Total users: ${pagination.count}`}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonLoader rows={5} columns={6} />
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: any) => (
                  <TableRow className="text-muted-foreground" key={user.user_guid}>
                    <TableCell>
                      <p className="font-semibold">{user.username}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold">
                        {user.first_name} {user.last_name}{" "}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{user.email}</p>
                    </TableCell>
                    <TableCell>
                      <p>{user.roles.includes("ADMIN") ? "Admin" : "Regular User"}</p>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`${
                          user.is_active
                            ? "bg-green-100 text-green-600"
                            : "bg-destructive/10 text-destructive"
                        } rounded-md px-2 py-1 text-sm font-medium shadow-xs`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`${user.is_email_verified
                          ? "bg-green-100 text-green-600"
                          : "bg-destructive/10 text-destructive"
                        } rounded-md px-2 py-1 text-sm font-medium shadow-xs`}
                      >
                        {user.is_email_verified ? "Verified" : "Not Verified"}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        className="btn-edit bg-primary text-primary-foreground cursor-pointer rounded"
                        onClick={() => handleEditUser(user)}
                        disabled={isSelf(user)}
                      >
                        <PenIcon size={12} />
                      </Button>
                      <Button
                        className="btn-delete bg-destructive text-primary-foreground cursor-pointer rounded"
                        disabled={isSelf(user)}
                        onClick={() => handleDeleteUser(user)}
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
      </div>
      <Modal open={isSignupModalOpen} onOpenChange={setIsSignupModalOpen} title="Add New User">
        <SignupForm onSuccess={() => {
          setIsSignupModalOpen(false);
          fetchUsers();
        }} addUser={true} />
      </Modal>
    </div>
  );
};

export default ManageUsersPage;
