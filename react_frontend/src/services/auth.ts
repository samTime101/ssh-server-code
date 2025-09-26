import { API_ENDPOINTS } from "@/config/apiConfig";
import type { LoginRequest, SignupRequest } from "@/types/auth";
import axios from "axios";

export const loginService = async ({ email, password }: LoginRequest) => {
  try {
    const loginResponse = await axios.post(API_ENDPOINTS.login, {
      email,
      password,
    });

    return loginResponse;
  } catch (error) {
    throw error;
  }
};

export const signupService = async ({
  email,
  username,
  phonenumber,
  firstname,
  lastname,
  password,
}: SignupRequest) => {
  try {
    const signupResponse = await axios.post(API_ENDPOINTS.signup, {
      email,
      username,
      phonenumber,
      firstname,
      lastname,
      password,
    });
    return signupResponse;
  } catch (error) {
    throw error;
  }
};
