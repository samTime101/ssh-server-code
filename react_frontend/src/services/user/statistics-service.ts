import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { UserStatistics } from "@/types/statistics";

/**
 * Fetch comprehensive user statistics from the backend.
 * Throws on network or server errors so the caller can handle them appropriately.
 */
export const getUserStatistics = async (): Promise<UserStatistics> => {
  const response = await axiosInstance.get<UserStatistics>(
    `${API_ENDPOINTS.accountInfo}statistics/`
  );
  return response.data;
};
