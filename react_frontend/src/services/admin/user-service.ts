import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { User, UserUpdate } from "@/types/user"

/**
 * Fetch a single user by ID
 */
export async function fetchUserById(userId: string): Promise<User> {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.usersList}${userId}/`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to fetch user");
  }
}

/**
 * Update a user's details
 */
export async function updateUser(userId: string, data: UserUpdate): Promise<User> {
  try {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.usersList}${userId}/`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to update user");
  }
}

/**
 * Get roles for a specific user
 */
export async function fetchUserRoles(userId: string): Promise<any[]> {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.userRoles}?user_id=${userId}`);
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to fetch user roles");
  }
}

/**
 * Assign a role to a user
 */
export async function assignRoleToUser(userId: string, roleId: string): Promise<any> {
  try {
    const response = await axiosInstance.post(`${API_ENDPOINTS.userRoles}`, {
      user: userId,
      role: roleId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to assign role");
  }
}

/**
 * Remove a role from a user
 */
export async function removeRoleFromUser(userRoleId: string): Promise<void> {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.userRoles}${userRoleId}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to remove role");
  }
}
