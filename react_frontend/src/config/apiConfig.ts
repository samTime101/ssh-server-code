export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const baseUrl = API_BASE_URL.endsWith("/api") ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const API_ENDPOINTS = {
  // Analytics
  analytics: "/analytics/questionbank/",

  // Auth
  login: "/auth/signin/",
  signup: "/auth/signup/",
  verifyEmail: "/auth/verify-email/",
  resetPasswordRequest: "/auth/reset-password-request/",
  resetPasswordVerify: "/auth/reset-password-verify/",
  resetPhoneNumber: "/auth/reset-phonenumber/",

  // Categories
  createCategory: "/categories/",
  getCategories: "/categories/",
  getCategoriesWithHierarchy: "/questions/hierarchy/",

  // Colleges
  colleges: "/colleges/",

  // Constraints
  constraints: "/constraints/",

  // Feedback
  feedback: "/feedback/",

  // Questions
  createQuestion: "/questions/",
  adminQuestions: "/questions/",
  selectQuestions: "/questions/select/",

  // Roles
  roles: "/roles/",

  // Sets
  questionSets: "/sets/",

  // Subcategories
  getSubcategories: "/subcategories/",
  createSubCategory: "/subcategories/",
  createSubSubCategory: "/create/subsubcategory/",

  // Submissions
  attemptQuestion: "/submissions/",

  // Users
  accountInfo: "/users/profile/",
  usersList: "/users/",
  bookmarks: "/users/bookmarks/",

  // Notes
  notes: "/notes/",
};
