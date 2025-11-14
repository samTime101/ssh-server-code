// export const API_BASE_URL = "http://localhost:8000/api"; //import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"; //"http://localhost:5173"
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/signin/`,
  signup: `${API_BASE_URL}/auth/signup/`,

  accountInfo: `${API_BASE_URL}/users/profile/`,

  createCategory: `${API_BASE_URL}/create/category/`,
  getCategories: `${API_BASE_URL}/categories/`,
  getCategoriesWithHierarchy: `${API_BASE_URL}/questions/hierarchy/`,
  createSubCategory: `${API_BASE_URL}/create/subcategory/`,
  createSubSubCategory: `${API_BASE_URL}/create/subsubcategory/`,

  selectQuestions: `${API_BASE_URL}/questions/select/`,
  attemptQuestion: `${API_BASE_URL}/user/attempt/`,
  
  // Admin Routes
  usersList: `${API_BASE_URL}/users/`,
  adminQuestions: `${API_BASE_URL}/questions`,
  
};
