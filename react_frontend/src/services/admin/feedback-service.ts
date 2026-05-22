import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { FeedbackListResponse } from "@/types/feedback";

export const fetchFeedbacks = async (
  page: number,
  pageSize: number
): Promise<FeedbackListResponse> => {
  const response = await axiosInstance.get(API_ENDPOINTS.feedback, {
    params: { page, page_size: pageSize },
  });
  return response.data as FeedbackListResponse;
};
