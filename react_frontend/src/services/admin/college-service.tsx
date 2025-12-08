import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "../axios";
import type { College } from "@/types/college";

export const fetchColleges = async (): Promise<College[]> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axiosInstance.get(API_ENDPOINTS.colleges, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Failed to fetch colleges:", error);
    throw error;
  }
};

export const createCollege = async (collegeData: Omit<College, "id">): Promise<College> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axiosInstance.post(API_ENDPOINTS.colleges, collegeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create college:", error);
    throw error;
  }
};

export const updateCollege = async (
  id: string,
  collegeData: Partial<Omit<College, "id">>
): Promise<College> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axiosInstance.patch(`${API_ENDPOINTS.colleges}${id}/`, collegeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update college:", error);
    throw error;
  }
};

export const deleteCollege = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("accessToken");
    await axiosInstance.delete(`${API_ENDPOINTS.colleges}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to delete college:", error);
    throw error;
  }
};
