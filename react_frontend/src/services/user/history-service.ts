import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { AxiosResponse } from "axios";
import type { SubmissionHistoryItem, SubmissionHistoryResponse } from "@/types/history";
import { getSubmissionItems } from "@/utils/historyUtils";

export const getSubmissionHistory = async (type?: string): Promise<SubmissionHistoryItem[]> => {
  try {
    const results: SubmissionHistoryItem[] = [];
    let nextUrl: string | null = API_ENDPOINTS.attemptQuestion;
    const params = type ? { type } : undefined;
    let pageCount = 0;

    while (nextUrl && pageCount < 50) {
      const response: AxiosResponse<SubmissionHistoryResponse> = await axiosInstance.get<SubmissionHistoryResponse>(nextUrl, {
        params: pageCount === 0 ? params : undefined,
      });

      if (!response) {
        break;
      }

      results.push(...getSubmissionItems(response.data));

      if (Array.isArray(response.data)) {
        nextUrl = null;
      } else {
        nextUrl = response.data.next ?? null;
      }

      pageCount += 1;
    }

    return results;
  } catch (error) {
    console.error("Error fetching submission history:", error);
    return [];
  }
};
