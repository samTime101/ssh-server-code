import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";

export interface ResetPhoneNumberRequest {
  new_phonenumber: string;
}

export const resetPhoneNumberService = async (data: ResetPhoneNumberRequest) => {
  return axiosInstance.post(API_ENDPOINTS.resetPhoneNumber, data);
};
