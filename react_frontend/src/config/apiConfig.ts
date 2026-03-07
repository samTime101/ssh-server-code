export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const API_ENDPOINTS = {
  login: "/auth/signin/",
  signup: "/auth/signup/",
  verifyEmail: "/auth/verify-email/",
  resetPassword: "/auth/reset-password/",
  resetPhoneNumber: "/auth/reset-phonenumber/",

  colleges: "/colleges/",

  accountInfo: "/users/profile/",

  createCategory: "/categories/",
  getCategories: "/categories/",
  getCategoriesWithHierarchy: "/questions/hierarchy/",
  createSubCategory: "/subcategories/",
  createSubSubCategory: "/create/subsubcategory/",

  selectQuestions: "/questions/select/",
  attemptQuestion: "/submissions/",
  createQuestion: "/questions/",

  // Admin Routes
  usersList: "/users/",
  adminQuestions: "/questions/",
  // Roles (backend endpoint should expose /roles/)
  roles: "/roles/",
  userRoles: "/user-roles/",
};
