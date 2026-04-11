import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { Attempt, SubmissionHistoryResponse } from "@/types/history";
import { flattenSubmissionAttempts } from "@/utils/historyUtils";

export const getSubmissionHistory = async (): Promise<Attempt[]> => {
  try {
    const response = await axiosInstance.get<SubmissionHistoryResponse>(
      API_ENDPOINTS.attemptQuestion
    );

    if (!response) {
      return [];
    }

    return flattenSubmissionAttempts(response.data);
  } catch (error) {
    console.error("Error fetching submission history:", error);
    return [];
  }
};
