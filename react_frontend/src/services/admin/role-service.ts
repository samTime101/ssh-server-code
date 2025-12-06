import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";

export type Role = {
  id: string;
  name: string;
};

export const fetchRoles = async (token: string): Promise<Role[]> => {
  const res = await axiosInstance.get(API_ENDPOINTS.roles, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};

export const createRole = async (roleName: string, token: string) => {
  const res = await axiosInstance.post(
    API_ENDPOINTS.roles,
    { name: roleName },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
