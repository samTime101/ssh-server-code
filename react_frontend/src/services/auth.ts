import { API_ENDPOINTS } from "@/config/apiConfig";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordVerifyRequest,
  SignupRequest,
} from "@/types/auth";
import axiosInstance from "@/services/axios";

export const loginService = async ({ email, password, recaptcha }: LoginRequest) => {
  return axiosInstance.post(API_ENDPOINTS.login, {
    email,
    password,
    ...(recaptcha ? { recaptcha } : {}),
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
  recaptcha,
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
    ...(recaptcha ? { recaptcha } : {}),
  });
};

export const verifyEmailService = async (token: string) => {
  return axiosInstance.get(`${API_ENDPOINTS.verifyEmail}${token}/`);
};

export const requestPasswordResetService = async ({ email, recaptcha }: ForgotPasswordRequest) => {
  return axiosInstance.post(API_ENDPOINTS.resetPasswordRequest, {
    email,
    ...(recaptcha ? { recaptcha } : {}),
  });
};

export const verifyPasswordResetService = async (
  token: string,
  data: ResetPasswordVerifyRequest
) => {
  return axiosInstance.post(`${API_ENDPOINTS.resetPasswordVerify}${token}/`, data);
};
