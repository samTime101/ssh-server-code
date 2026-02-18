import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "../axios";
import type { College } from "@/types/college";

export interface PaginatedCollegesResponse {
  count: number;
  total_pages: number;
  results: College[];
  next: string | null;
  previous: string | null;
}

export const fetchColleges = async (
  page?: number,
  pageSize?: number
): Promise<PaginatedCollegesResponse> => {
  try {
    const params: Record<string, number> = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;

    const response = await axiosInstance.get(API_ENDPOINTS.colleges, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch colleges:", error);
    throw error;
  }
};

export const fetchAllColleges = async (): Promise<College[]> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.colleges, {
      params: { page_size: 1000 },
    });
    return response.data.results;
  } catch (error) {
    console.error("Failed to fetch all colleges:", error);
    throw error;
  }
};

export const createCollege = async (collegeData: Omit<College, "id">): Promise<College> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.colleges, collegeData);
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
    const response = await axiosInstance.patch(`${API_ENDPOINTS.colleges}${id}/`, collegeData);
    return response.data;
  } catch (error) {
    console.error("Failed to update college:", error);
    throw error;
  }
};

export const deleteCollege = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.colleges}${id}/`);
  } catch (error) {
    console.error("Failed to delete college:", error);
    throw error;
  }
};
