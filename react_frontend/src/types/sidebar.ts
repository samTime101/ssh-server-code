import { Plus } from "lucide-react";

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavItem {
  icon: typeof Plus;
  text: string;
  path: string;
  allowedPermissions: string[];
}

export interface CollapsibleNavGroupProps {
  icon: typeof Plus;
  label: string;
  items: NavItem[];
  isGroupActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onNavClick: () => void;
  currentPath: string;
}
