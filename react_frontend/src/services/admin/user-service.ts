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


// Already getting roles directly from user profile by id
/**
 * Get roles for a specific user
 */
// export async function fetchUserRoles(userId: string): Promise<any[]> {
//   try {
//     const response = await axiosInstance.get(`${API_ENDPOINTS.userRoles}?user_id=${userId}`);
//     return Array.isArray(response.data) ? response.data : response.data.results || [];
//   } catch (error: any) {
//     throw new Error(error.response?.data?.detail || "Failed to fetch user roles");
//   }
// }

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