import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { User, UserUpdate } from "@/types/user";

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
 * Assign a role to a user
 */
export async function assignRoleToUser(userGuid: string, roleId: string): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/users/${userGuid}/assign-role/`,  // Adjusted endpoint manually for now
      { role_ids: [roleId] }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to assign role");
  }
}

export async function removeRoleFromUser(userGuid: string, roleId: string): Promise<any> {
  try {
    const response = await axiosInstance.post(
      `/users/${userGuid}/remove-role/`,
      { role_ids: [roleId] }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to remove role");
  }
}

/**
 * Delete a user by ID
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.usersList}${userId}/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to delete user");
  }
}
