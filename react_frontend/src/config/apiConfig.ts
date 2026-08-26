import { getApiBaseUrl } from "@/config/tenant";

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const apiBase = getApiBaseUrl();
  const baseUrl = apiBase.endsWith("/api") ? apiBase.slice(0, -4) : apiBase;
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const API_ENDPOINTS = {
  // Analytics
  analytics: "/analytics/questionbank/",
  dashboardStats: "/analytics/dashboard/",

  // Auth
  login: "/auth/signin/",
  signup: "/auth/signup/",
  googleLogin: "/auth/google/",
  googleSignup: "/auth/google/signup/",
  verifyEmail: "/auth/verify-email/",
  resetPasswordRequest: "/auth/forgot-password-request/",
  resetPasswordVerify: "/auth/forgot-password-verify/",
  resetPassword: "/auth/change-password/",
  resetPhoneNumber: "/auth/change-phonenumber/",
  setupAdmin: "/auth/setup-admin/",

  // Categories
  createCategory: "/categories/",
  getCategories: "/categories/",
  getCategoriesWithHierarchy: "/questions/hierarchy/",

  // Clients
  clients: "/clients/",

  // Colleges
  colleges: "/colleges/",

  // Constraints
  constraints: "/constraints/",

  // Feedback
  feedback: "/feedback/",

  // Reactions
  reactions: "/reactions/",
  reactionCheck: (questionId: string) => `/reactions/check/${questionId}/`,
  reactionCount: (questionId: string) => `/reactions/count/${questionId}/`,

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

  // Subscriptions
  subscriptions: "/subscriptions/",

  // Users
  accountInfo: "/users/profile/",
  usersList: "/users/",
  bookmarks: "/users/bookmarks/",
  assignRole: (userGuid: string) => `/users/${userGuid}/assign-role/`,
  removeRole: (userGuid: string) => `/users/${userGuid}/remove-role/`,

  // Notes
  notes: "/notes/",

  // Testimonials
  testimonials: "/testimonials/",
};
