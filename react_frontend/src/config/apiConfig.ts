export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const baseUrl = API_BASE_URL.endsWith("/api") ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

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
  getSubcategories: "/subcategories/",
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
