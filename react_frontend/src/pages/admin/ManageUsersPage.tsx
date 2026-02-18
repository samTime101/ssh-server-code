import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { PenIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Paginator from "@/components/Paginator";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";
import type { User } from "@/types/user";

const ManageUsersPage = () => {
  const { token, user: authUser } = useAuth();
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState([]);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const isSelf = (user: User) => authUser && (user.user_guid === authUser.userId || user.id === authUser.id);
  const isSelf = (user: User): boolean => {
    if (!authUser) return false;
    return user.user_guid === authUser.userId || user.id === authUser.id;
  };
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, currentPage, pageSize]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.usersList, {
        params: {
          page: currentPage,
          page_size: pageSize,
        },
      });
      console.log("Fetched users response:", response);
      if (!response) {
        console.error("No response from server");
        throw new Error("No response from server");
      }

      setUsersList(response.data.results);
      setPagination({
        total_pages: response.data.total_pages,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      toast.error("An error occurred while fetching users");
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const filteredUsers = usersList.filter((user: any) =>
    `${user.firstname} ${user.lastname} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  return (
    <div>
      <div className="manage-users-header">
        <h1 className="manage-users-title text-2xl font-bold">Manage Users</h1>
      </div>
      <div className="manage-users-content">
        {/* User management functionalities will go here */}
        <p>This is where admin can manage users.</p>
      </div>
      <div className="manage-users-main-content mt-4 rounded-md border bg-white p-4 shadow-md">
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
                {/* <TableHead>Id</TableHead> */}
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableRow key={user.user_guid}>
                    <TableCell>
                      <p className="font-semibold">{user.username}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold">
                        {user.first_name} {user.last_name}{" "}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-muted-foreground text-sm">{user.email}</p>
                    </TableCell>
                    <TableCell>
                      <p>{user.roles.includes("ADMIN") ? "Admin" : "Regular User"}</p>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`${
                          user.is_active ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
                        } rounded-md px-2 py-1 text-sm font-medium shadow-xs`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        className="btn-edit cursor-pointer rounded bg-blue-500 text-white"
                        onClick={() => navigate(`/admin/manage-users/${user.user_guid}`)}
                        disabled={isSelf(user)}
                      >
                        <PenIcon size={12} />
                      </Button>
                      <Button className="btn-delete cursor-pointer rounded bg-red-500 text-white" disabled={isSelf(user)}>
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
    </div>
  );
};

export default ManageUsersPage;
