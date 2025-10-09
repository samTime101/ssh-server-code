import { useState } from "react";
import { 
  LayoutDashboard, 
  Plus, 
  Folder, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/admin/dashboard" },
    { icon: Plus, text: "Add Question", path: "/admin/add-question" },
    { icon: Folder, text: "Create Category", path: "/admin/create-category" },
    { icon: Users, text: "Manage Users", path: "/admin/users" },
    { icon: BarChart3, text: "Analytics", path: "/admin/analytics" },
    { icon: FileText, text: "Question Bank", path: "/admin/question-bank" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-600 z-10 flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-slate-600 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 dark:bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Admin Panel</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="flex flex-col gap-2 px-4">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = item.text === activeItem;

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setActiveItem(item.text)}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 dark:bg-emerald-600 text-white shadow-sm"
                    : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                <IconComponent 
                  size={18} 
                  className={isActive ? "text-white" : "text-gray-500 dark:text-slate-400"} 
                />
                <p className="font-medium text-sm">{item.text}</p>
              </Link>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 dark:border-slate-600 space-y-2">
        <div className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer text-gray-700 dark:text-slate-300 transition-all duration-200">
          <Settings size={18} className="text-gray-500 dark:text-slate-400" />
          <p className="font-medium text-sm">Settings</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all duration-200"
        >
          <LogOut size={18} className="text-red-500 dark:text-red-400" />
          <p className="font-medium text-sm">Logout</p>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;