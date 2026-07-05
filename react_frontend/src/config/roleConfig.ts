const ROLE_CONFIG = {
  ADMIN: [
    "dashboard",
    "add-question",
    "create-category",
    "manage-categories",
    "manage-subcategories",
    "manage-users",
    "manage-users/:id",
    "add-role",
    "add-college",
    "question-bank",
    "manage-question-sets",
    "manage-constraints",
    "manage-subscriptions",
    "application-feedback",
    "analytics",
  ],
  CONTRIBUTOR: ["add-question"],
  DOCTOR: ["add-question", "question-bank"],
};

export default ROLE_CONFIG;
