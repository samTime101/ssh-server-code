import { API_ENDPOINTS } from "@/config/apiConfig";
import type { LoginRequest, SignupRequest } from "@/types/auth";
import axiosInstance from "@/services/axios";

export const loginService = async ({ email, password }: LoginRequest) => {
  return axiosInstance.post(API_ENDPOINTS.login, {
    email,
    password,
  });
};

export const signupService = async ({
  email,
  username,
  phonenumber,
  first_name,
  last_name,
  password,
  confirm_password,
  college,
}: SignupRequest) => {
  return axiosInstance.post(API_ENDPOINTS.signup, {
    email,
    username,
    phonenumber,
    first_name,
    last_name,
    password,
    confirm_password,
    college,
  });
};

export const verifyEmailService = async (token: string) => {
  return axiosInstance.get(`${API_ENDPOINTS.verifyEmail}${token}/`);
};
