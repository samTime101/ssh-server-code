import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ROLE_CONFIG from "@/config/roleConfig";
import {
  TOP_MENU_ITEMS,
  BOTTOM_MENU_ITEMS,
  QUESTION_SUB_ITEMS,
  CATEGORY_SUB_ITEMS,
} from "@/config/sidebarConfig";

export const useAdminSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const hasPermission = (allowedPermissions: string[]) =>
    user?.roles?.some((role: string) =>
      allowedPermissions.every((perm) =>
        ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]?.includes(perm)
      )
    ) ?? false;

  const visibleTopItems = TOP_MENU_ITEMS.filter((item) => hasPermission(item.allowedPermissions));
  const visibleBottomItems = BOTTOM_MENU_ITEMS.filter((item) =>
    hasPermission(item.allowedPermissions)
  );
  const visibleQuestionItems = QUESTION_SUB_ITEMS.filter((item) =>
    hasPermission(item.allowedPermissions)
  );
  const visibleCategoryItems = CATEGORY_SUB_ITEMS.filter((item) =>
    hasPermission(item.allowedPermissions)
  );

  const isQuestionGroupActive = QUESTION_SUB_ITEMS.some((item) => location.pathname === item.path);
  const isCategoryGroupActive = CATEGORY_SUB_ITEMS.some((item) => location.pathname === item.path);

  const [questionsOpen, setQuestionsOpen] = useState(isQuestionGroupActive);
  const [categoriesOpen, setCategoriesOpen] = useState(isCategoryGroupActive);

  return {
    currentPath: location.pathname,
    visibleTopItems,
    visibleBottomItems,
    visibleQuestionItems,
    visibleCategoryItems,
    isQuestionGroupActive,
    isCategoryGroupActive,
    questionsOpen,
    categoriesOpen,
    toggleQuestions: () => setQuestionsOpen((prev) => !prev),
    toggleCategories: () => setCategoriesOpen((prev) => !prev),
  };
};
