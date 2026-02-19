import { API_ENDPOINTS } from "@/config/apiConfig";
import axiosInstance from "@/services/axios";

export interface ResetPasswordRequest {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface ResetPhoneNumberRequest {
  new_phonenumber: string;
}

export const resetPasswordService = async (data: ResetPasswordRequest) => {
  return axiosInstance.post(API_ENDPOINTS.resetPassword, data);
};

export const resetPhoneNumberService = async (data: ResetPhoneNumberRequest) => {
  return axiosInstance.post(API_ENDPOINTS.resetPhoneNumber, data);
};
