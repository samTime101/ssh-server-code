import { API_ENDPOINTS } from "@/config/apiConfig";
import type {
  ForgotPasswordRequest,
  GoogleLoginRequest,
  GoogleLoginResponse,
  GoogleSignupRequest,
  GoogleSignupResponse,
  LoginRequest,
  ResetPasswordVerifyRequest,
  SetupAdminRequest,
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

export const googleLogin = async ({ code }: GoogleLoginRequest) => {
  return axiosInstance.post<GoogleLoginResponse>(API_ENDPOINTS.googleLogin, { code });
};

export const googleSignup = async ({
  signup_token,
  username,
  phonenumber,
  college,
}: GoogleSignupRequest) => {
  return axiosInstance.post<GoogleSignupResponse>(API_ENDPOINTS.googleSignup, {
    signup_token,
    username,
    phonenumber,
    college,
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

export const setupAdminService = async (token: string, data: SetupAdminRequest) => {
  return axiosInstance.post(`${API_ENDPOINTS.setupAdmin}${token}/`, data);
};
