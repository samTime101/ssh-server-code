import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { Subscription, SubscriptionPayload } from "@/types/subscription";

const buildFormData = (payload: SubscriptionPayload, imageFile?: File | null): FormData => {
  const formData = new FormData();
  formData.append("plan_name", payload.plan_name);
  formData.append("description", payload.description);
  formData.append("price", payload.price);
  formData.append("number_of_months", String(payload.number_of_months));
  formData.append("status", String(payload.status));
  if (imageFile) formData.append("image_url", imageFile);
  return formData;
};

export const createSubscription = async (
  payload: SubscriptionPayload,
  imageFile?: File | null
): Promise<Subscription> => {
  try {
    const formData = buildFormData(payload, imageFile);
    const response = await axiosInstance.post(API_ENDPOINTS.subscriptions, formData);
    return response.data;
  } catch (error) {
    console.error("Failed to create subscription:", error);
    throw new Error("Failed to create subscription");
  }
};

export const updateSubscription = async (
  id: number,
  payload: SubscriptionPayload,
  imageFile?: File | null
): Promise<Subscription> => {
  try {
    const formData = buildFormData(payload, imageFile);
    const response = await axiosInstance.patch(`${API_ENDPOINTS.subscriptions}${id}/`, formData);
    return response.data;
  } catch (error) {
    console.error("Failed to update subscription:", error);
    throw new Error("Failed to update subscription");
  }
};

export const deleteSubscription = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_ENDPOINTS.subscriptions}${id}/`);
  } catch (error) {
    console.error("Failed to delete subscription:", error);
    throw new Error("Failed to delete subscription");
  }
};
