import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";

export const getSubmissionHistory = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.attemptQuestion);

    if (!response) {
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching submission history:", error);
    return null;
  }
};
