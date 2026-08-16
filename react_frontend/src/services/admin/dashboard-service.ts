import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { AdminDashboardStats } from "@/types/dashboard";

const emptyStats: AdminDashboardStats = {
  total_questions: 0,
  active_users: 0,
  current_subscription: "Free",
};

export const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.dashboardStats);
    return response.data as AdminDashboardStats;
  } catch {
    return emptyStats;
  }
};
