import { API_ENDPOINTS } from "@/config/apiConfig";
import type { LoginRequest, SignupRequest } from "@/types/auth";
import axios from "axios";

export const loginService = async ({ email, password }: LoginRequest) => {
  return axios.post(API_ENDPOINTS.login, {
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
}: SignupRequest) => {
  return axios.post(API_ENDPOINTS.signup, {
    email,
    username,
    phonenumber,
    first_name,
    last_name,
    password,
  });
};