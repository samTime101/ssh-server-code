import { useCallback, useEffect, useState } from "react";

export const SIDEBAR_WIDTH_EXPANDED = "16rem";
export const SIDEBAR_WIDTH_COLLAPSED = "4rem";

export const useSidebarCollapse = (scope: "admin" | "user") => {
  const storageKey = `sidebar-collapsed-${scope}`;

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem(storageKey) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(isCollapsed));
    } catch {
      // ignore storage errors
    }
  }, [isCollapsed, storageKey]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return { isCollapsed, toggleCollapse };
};
