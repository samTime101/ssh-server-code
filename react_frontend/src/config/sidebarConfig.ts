import {
  LayoutDashboard,
  Plus,
  Folder,
  Users,
  BarChart3,
  FileText,
  Settings,
  List,
} from "lucide-react";
import type { NavItem } from "@/types/sidebar";

export const TOP_MENU_ITEMS: NavItem[] = [
  {
    icon: LayoutDashboard,
    text: "Dashboard",
    path: "/admin/",
    allowedPermissions: ["dashboard"],
  },
];

export const BOTTOM_MENU_ITEMS: NavItem[] = [
  {
    icon: Users,
    text: "Manage Users",
    path: "/admin/manage-users",
    allowedPermissions: ["manage-users"],
  },
  {
    icon: BarChart3,
    text: "Analytics",
    path: "/admin/analytics",
    allowedPermissions: ["analytics"],
  },
  {
    icon: Plus,
    text: "Add Role",
    path: "/admin/add-role",
    allowedPermissions: ["add-role"],
  },
  {
    icon: Folder,
    text: "Manage Colleges",
    path: "/admin/add-college",
    allowedPermissions: ["add-college"],
  },
];

export const QUESTION_SUB_ITEMS: NavItem[] = [
  {
    icon: Plus,
    text: "Add Question",
    path: "/admin/add-question",
    allowedPermissions: ["add-question"],
  },
  {
    icon: FileText,
    text: "Question Bank",
    path: "/admin/question-bank",
    allowedPermissions: ["question-bank"],
  },
];

export const CATEGORY_SUB_ITEMS: NavItem[] = [
  {
    icon: Plus,
    text: "Create Category",
    path: "/admin/create-category",
    allowedPermissions: ["create-category"],
  },
  {
    icon: List,
    text: "Manage Categories",
    path: "/admin/manage-categories",
    allowedPermissions: ["manage-categories"],
  },
  {
    icon: Settings,
    text: "Manage Subcategories",
    path: "/admin/manage-subcategories",
    allowedPermissions: ["manage-subcategories"],
  },
];
