import {
  LayoutDashboard,
  Plus,
  Folder,
  Users,
  Building2,
  BarChart3,
  FileText,
  Settings,
  List,
  SlidersHorizontal,
  MessageSquare,
  CreditCard,
  Quote,
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
    icon: Building2,
    text: "Manage Clients",
    path: "/admin/manage-clients",
    allowedPermissions: ["manage-clients"],
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
  {
    icon: CreditCard,
    text: "Subscriptions",
    path: "/admin/manage-subscriptions",
    allowedPermissions: ["manage-subscriptions"],
  },
  {
    icon: Quote,
    text: "Testimonials",
    path: "/admin/testimonials",
    allowedPermissions: ["manage-testimonials"],
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
  {
    icon: List,
    text: "Question Sets",
    path: "/admin/manage-question-sets",
    allowedPermissions: ["manage-question-sets"],
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
  {
    icon: SlidersHorizontal,
    text: "Constraints",
    path: "/admin/manage-constraints",
    allowedPermissions: ["manage-constraints"],
  },
];

export const FEEDBACK_SUB_ITEMS: NavItem[] = [
  {
    icon: MessageSquare,
    text: "Application Feedback",
    path: "/admin/feedback/application",
    allowedPermissions: ["application-feedback"],
  },
  {
    icon: MessageSquare,
    text: "Question Feedback",
    path: "/admin/feedback/question",
    allowedPermissions: ["application-feedback"],
  },
];
