import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";

export const getBookmarks = async (page = 1, pageSize = 5) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.bookmarks, {
      params: { page, page_size: pageSize },
    });
    if (!response) return null;
    return response.data;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return null;
  }
};

export const getAllBookmarkIds = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.bookmarks, {
      params: { page: 1, page_size: 1000 },
    });
    if (!response?.data?.results) return [];
    return response.data.results.map(
      (item: { question_id: string }) => item.question_id
    );
  } catch (error) {
    console.error("Error fetching bookmark IDs:", error);
    return [];
  }
};

export const getQuestionById = async (questionId: string) => {
  try {
    const response = await axiosInstance.get(`/questions/${questionId}/`);
    if (!response) return null;
    return response.data;
  } catch (error) {
    console.error(`Error fetching question ${questionId}:`, error);
    return null;
  }
};

export const bookmarkQuestion = async (questionId: string) => {
  try {
    const response = await axiosInstance.post(`/questions/${questionId}/bookmark/`);
    if (!response) return null;
    return response.data;
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return null;
  }
};

export const removeBookmark = async (questionId: string) => {
  try {
    const response = await axiosInstance.delete(`/questions/${questionId}/bookmark/`);
    if (!response) return null;
    return response.data;
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};
