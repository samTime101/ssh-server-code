import { Bell, Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600 px-4 lg:px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left Section - Hamburger and Title */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu (Mobile Only) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <Menu size={20} className="text-gray-600 dark:text-slate-400" />
          </button>
          
          <h1 className="text-lg lg:text-xl font-semibold text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>
        </div>

        {/* Right Section - Notifications and Profile */}
        <div className="flex items-center gap-3 lg:gap-8">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Admin Profile */}
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-800 dark:text-white">Admin User</div>
              <div className="text-xs text-gray-500 dark:text-slate-400">Administrator</div>
            </div>
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 dark:bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs lg:text-sm font-semibold">AU</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;