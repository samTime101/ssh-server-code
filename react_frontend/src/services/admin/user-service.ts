import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";

export interface User {
  id: string | number;
  user_guid?: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
}

/**
 * Fetch a single user by ID
 */
export async function fetchUserById(userId: string, token: string): Promise<User> {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.usersList}${userId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to fetch user");
  }
}

/**
 * Update a user's details
 */
export async function updateUser(
  userId: string,
  data: UserUpdate,
  token: string
): Promise<User> {
  try {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.usersList}${userId}/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to update user");
  }
}

/**
 * Get roles for a specific user
 */
export async function fetchUserRoles(userId: string, token: string): Promise<any[]> {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.userRoles}?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to fetch user roles");
  }
}

/**
 * Assign a role to a user
 */
export async function assignRoleToUser(
  userId: string,
  roleId: string,
  token: string
): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.userRoles}`,
      { user: userId, role: roleId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to assign role");
  }
}

/**
 * Remove a role from a user
 */
export async function removeRoleFromUser(
  userRoleId: string,
  token: string
): Promise<void> {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.userRoles}${userRoleId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to remove role");
  }
}
