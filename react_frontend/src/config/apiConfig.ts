const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (typeof window === "undefined") return envUrl || "http://localhost:8000/api";
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Handle local subdomain testing (e.g. acme.localhost:5176 -> acme.localhost:8000/api)
  if (hostname.endsWith(".localhost")) {
    return `${protocol}//${hostname}:8000/api`;
  }

  // Handle production subdomains (e.g. acme.vaidix.org -> acme.vaidix.org/api)
  const parts = hostname.split('.');
  if (parts.length > 2 && hostname !== "127.0.0.1") {
    return `${protocol}//${hostname}/api`;
  }

  // Fallback to env URL if configured, otherwise use current hostname
  return envUrl || `${protocol}//${hostname}:8000/api`;
};

export const API_BASE_URL = getApiBaseUrl();

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const baseUrl = API_BASE_URL.endsWith("/api") ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
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

  // Notes
  notes: "/notes/",

  // Testimonials
  testimonials: "/testimonials/",
};
