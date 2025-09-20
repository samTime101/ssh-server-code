const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/signin/`,
  signup: `${API_BASE_URL}/signup/`,
};
