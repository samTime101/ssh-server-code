import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "../axios";

export const fetchColleges = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.colleges);
    return response.data.results;
  } catch (error) {
    console.error("Failed to fetch colleges:", error);
  }
};
