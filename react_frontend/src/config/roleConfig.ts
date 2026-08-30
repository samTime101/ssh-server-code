const ROLE_CONFIG = {
  ADMIN: [
    "dashboard",
    "add-question",
    "manage-categories",
    "manage-subcategories",
    "manage-users",
    "manage-users/:id",
    "manage-clients",
    "add-role",
    "add-college",
    "question-bank",
    "manage-question-sets",
    "manage-constraints",
    "manage-subscriptions",
    "application-feedback",
    "analytics",
    "manage-testimonials",
  ],
  CONTRIBUTOR: ["add-question"],
  DOCTOR: ["add-question", "question-bank"],
};

export default ROLE_CONFIG;
