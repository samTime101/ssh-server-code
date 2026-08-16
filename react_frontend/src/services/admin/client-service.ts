import axiosInstance from "@/services/axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import type { Client, PaginatedClientsResponse } from "@/types/client";

export const fetchClients = async (
  page?: number,
  pageSize?: number
): Promise<PaginatedClientsResponse> => {
  try {
    const params: Record<string, number> = {};
    if (page) params.page = page;
    if (pageSize) params.page_size = pageSize;

    const response = await axiosInstance.get(API_ENDPOINTS.clients, { params });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    throw error;
  }
};

export const createClient = async (data: FormData): Promise<Client> => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.clients, data);
    return response.data;
  } catch (error) {
    console.error("Failed to create client:", error);
    throw error;
  }
};

export const updateClient = async (id: string, data: FormData): Promise<Client> => {
  try {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.clients}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update client:", error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.clients}${id}/`);
  } catch (error) {
    console.error("Failed to delete client:", error);
    throw error;
  }
};
