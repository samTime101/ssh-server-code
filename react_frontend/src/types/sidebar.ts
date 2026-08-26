import { Plus } from "lucide-react";

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface NavItem {
  icon: typeof Plus;
  text: string;
  path: string;
  allowedPermissions: string[];
  platformOnly?: boolean;
}

export interface CollapsibleNavGroupProps {
  icon: typeof Plus;
  label: string;
  items: NavItem[];
  isGroupActive: boolean;
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onNavClick: () => void;
  isPathActive: (path: string) => boolean;
}
