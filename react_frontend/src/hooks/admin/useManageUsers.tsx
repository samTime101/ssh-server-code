import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { deleteUser } from "@/services/admin/user-service";
import type { User } from "@/types/user";

export const useManageUsers = () => {
  const { token, user: authUser } = useAuth();
  const navigate = useNavigate();

  const [usersList, setUsersList] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    count: 0,
    total_pages: 0,
    next: null as string | null,
    previous: null as string | null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isSelf = (user: User): boolean => {
    if (!authUser) return false;
    return user.user_guid === authUser.userId || user.id === authUser.id;
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, currentPage, pageSize]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.usersList, {
        params: { page: currentPage, page_size: pageSize },
      });
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

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) return;
    try {
      await deleteUser(user.user_guid);
      toast.success("User deleted successfully");
      if (usersList.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchUsers();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user: User) => navigate(`/admin/manage-users/${user.user_guid}`);

  const filteredUsers = usersList.filter((user: any) =>
    `${user.first_name} ${user.last_name} ${user.email}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return {
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
    fetchUsers,
  };
};
