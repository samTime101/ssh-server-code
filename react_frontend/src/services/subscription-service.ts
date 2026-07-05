import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";
import type { Subscription } from "@/types/subscription";
import { toSubscriptionList } from "@/utils/subscriptionUtils";

export const fetchSubscriptions = async (activeOnly = false): Promise<Subscription[]> => {
  try {
    const params = activeOnly ? { status: true, page_size: 100 } : { page_size: 100 };
    const response = await axiosInstance.get(API_ENDPOINTS.subscriptions, { params });
    return toSubscriptionList(response.data);
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
    throw new Error("Failed to fetch subscriptions");
  }
};
