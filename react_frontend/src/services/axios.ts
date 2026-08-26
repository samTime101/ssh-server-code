import { getApiBaseUrl } from "@/config/tenant";
import { getGlobalLogout } from "@/contexts/AuthContext";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      // error.response?.data?.messages?.some((msg: any) => msg.message === "Token is expired") &&
      error.response?.data?.code === "token_not_valid" &&
      error.response?.status === 401
    ) {
      const logout = getGlobalLogout();
      if (logout) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
