import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { SubmissionHistoryItem, SubmissionHistoryResponse } from "@/types/history";
import { getSubmissionItems } from "@/utils/historyUtils";

export const getSubmissionHistory = async (): Promise<SubmissionHistoryItem[]> => {
  try {
    const response = await axiosInstance.get<SubmissionHistoryResponse>(
      API_ENDPOINTS.attemptQuestion
    );

    if (!response) {
      return [];
    }

    return getSubmissionItems(response.data);
  } catch (error) {
    console.error("Error fetching submission history:", error);
    return [];
  }
};
