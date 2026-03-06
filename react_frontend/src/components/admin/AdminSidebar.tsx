import {
  LayoutDashboard,
  Plus,
  Folder,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ROLE_CONFIG from "@/config/roleConfig";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: typeof Plus;
  text: string;
  path: string;
  allowedPermissions: string[];
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  // Define all available menu items with their required roles
  const allMenuItems: MenuItem[] = [
    {
      icon: LayoutDashboard,
      text: "Dashboard",
      path: "/admin/",
      allowedPermissions: ["dashboard"],
    },
    {
      icon: Plus,
      text: "Add Question",
      path: "/admin/add-question",
      allowedPermissions: ["add-question"],
    },
    {
      icon: Folder,
      text: "Create Category",
      path: "/admin/create-category",
      allowedPermissions: ["create-category"],
    },
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
      icon: FileText,
      text: "Question Bank",
      path: "/admin/question-bank",
      allowedPermissions: ["question-bank"],
    },
    { icon: Plus, text: "Add Role", path: "/admin/add-role", allowedPermissions: ["add-role"] },
    {
      icon: Folder,
      text: "Manage Colleges",
      path: "/admin/add-college",
      allowedPermissions: ["add-college"],
    },
  ];

  // Filter menu items based on user's roles and permissions
  const menuItems = allMenuItems.filter((item) =>
    user?.roles?.some((role: string) =>
      item.allowedPermissions.every((perm) =>
        ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]?.includes(perm)
      )
    )
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="bg-foreground/20 fixed inset-0 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`border-sidebar-border bg-sidebar fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:z-10 lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="border-sidebar-border flex-shrink-0 border-b px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-sidebar-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-sidebar-primary-foreground text-sm font-bold">A</span>
              </div>
              <h2 className="text-sidebar-foreground text-lg font-semibold">Admin Panel</h2>
            </div>
            {/* Close button for mobile */}
            <button onClick={onClose} className="hover:bg-sidebar-accent rounded-lg p-2 lg:hidden">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="flex flex-col gap-2 px-4">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => {
                    onClose(); // Close sidebar on mobile after selecting
                  }}
                  className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <IconComponent
                    size={18}
                    className={
                      isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground"
                    }
                  />
                  <p className="text-sm font-medium">{item.text}</p>
                </Link>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-sidebar-border flex-shrink-0 space-y-2 border-t px-4 py-4">
          <div className="text-sidebar-foreground hover:bg-sidebar-accent flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200">
            <Settings size={18} className="text-muted-foreground" />
            <p className="text-sm font-medium">Settings</p>
          </div>

          <button
            onClick={handleLogout}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200"
          >
            <LogOut size={18} className="text-destructive" />
            <p className="text-sm font-medium">Logout</p>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
