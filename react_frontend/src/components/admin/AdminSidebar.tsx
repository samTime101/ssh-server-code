import { useState } from "react";
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
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/admin/dashboard" },
    { icon: Plus, text: "Add Question", path: "/admin/add-question" },
    { icon: Folder, text: "Create Category", path: "/admin/create-category" },
    { icon: Users, text: "Manage Users", path: "/admin/manage-users" },
    { icon: BarChart3, text: "Analytics", path: "/admin/analytics" },
    { icon: FileText, text: "Question Bank", path: "/admin/question-bank" },
    { icon: Plus, text: "Add Role", path: "/admin/add-role" },
    { icon: Folder, text: "Manage Colleges", path: "/admin/add-college" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="bg-opacity-50 fixed inset-0 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-slate-600 dark:bg-slate-800 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:z-10 lg:translate-x-0`}
      >
        {/* Logo Section */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-6 dark:border-slate-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 dark:bg-emerald-600">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Admin Panel</h2>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden dark:hover:bg-slate-700"
            >
              <X size={20} className="text-gray-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="flex flex-col gap-2 px-4">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = item.text === activeItem;

              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => {
                    setActiveItem(item.text);
                    onClose(); // Close sidebar on mobile after selecting
                  }}
                  className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm dark:bg-emerald-600"
                      : "text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  <IconComponent
                    size={18}
                    className={isActive ? "text-white" : "text-gray-500 dark:text-slate-400"}
                  />
                  <p className="text-sm font-medium">{item.text}</p>
                </Link>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="flex-shrink-0 space-y-2 border-t border-gray-200 px-4 py-4 dark:border-slate-600">
          <div className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700">
            <Settings size={18} className="text-gray-500 dark:text-slate-400" />
            <p className="text-sm font-medium">Settings</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-red-600 transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut size={18} className="text-red-500 dark:text-red-400" />
            <p className="text-sm font-medium">Logout</p>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
