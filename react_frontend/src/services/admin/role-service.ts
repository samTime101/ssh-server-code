import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { Role } from "@/types/role";

export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const res = await axiosInstance.get(API_ENDPOINTS.roles);
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw new Error("Failed to fetch roles");
  }
};

export const createRole = async (roleName: string) => {
  try {
    const res = await axiosInstance.post(API_ENDPOINTS.roles, { name: roleName });
    return res.data;
  } catch (error) {
    console.error("Failed to create role:", error);
    throw new Error("Failed to create role");
  }
};
