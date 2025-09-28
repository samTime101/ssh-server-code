const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; //"http://localhost:5173"

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/signin/`,
  signup: `${API_BASE_URL}/signup/`,

  createCategory: `${API_BASE_URL}/create/category/`,
  getCategories: `${API_BASE_URL}/get/categories/`,

  selectQuestions: `${API_BASE_URL}/select/questions/`,
  attemptQuestion: `${API_BASE_URL}/user/attempt/`,
};
