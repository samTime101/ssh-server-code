// export const API_BASE_URL = "http://localhost:8000/api"; //import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; //"http://localhost:5173"
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/signin/`,
  signup: `${API_BASE_URL}/signup/`,

  userInfo: `${API_BASE_URL}/user/`,

  createCategory: `${API_BASE_URL}/create/category/`,
  getCategories: `${API_BASE_URL}/get/categories/`,

  createSubCategory: `${API_BASE_URL}/create/subcategory/`,
  createSubSubCategory: `${API_BASE_URL}/create/subsubcategory/`,

  selectQuestions: `${API_BASE_URL}/select/questions/`,
  attemptQuestion: `${API_BASE_URL}/user/attempt/`,
  createQuestion: `${API_BASE_URL}/create/question/`,
};
