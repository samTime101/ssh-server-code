const ROLE_CONFIG = {
  ADMIN: [
    "dashboard",
    "add-question",
    "create-category",
    "manage-users",
    "manage-users/:id",
    "add-role",
    "add-college",
    "question-bank",
    "analytics",
  ],
  CONTRIBUTOR: [
    "add-question",
  ],
  DOCTOR: [
    "add-question",
    "question-bank",
  ],
};

export default ROLE_CONFIG;