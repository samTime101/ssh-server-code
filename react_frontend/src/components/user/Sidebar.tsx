import React, { useState } from "react";
import { Book, Stethoscope, Folder, FileText, User, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const { logout } = useAuth();
  const [activeItem, setActiveItem] = useState("Question Bank");

  const menuItems = [
    { icon: Book, text: "Question Bank", path: "/userpanel/question-bank" },
    { icon: Stethoscope, text: "CEE Practice", path: "/userpanel/cee-practice" },
    { icon: Folder, text: "Case Studies", path: "/userpanel/case-studies" },
    { icon: FileText, text: "Mock Exams", path: "/userpanel/mock-exams" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-gray-50 border-r border-gray-200 z-10 flex flex-col">
      <div className="px-4 py-6 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-xl font-bold text-blue-600 text-center">SISANI-EPS</h2>
      </div>

      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="flex flex-col gap-2 px-3">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = item.text === activeItem;

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setActiveItem(item.text)}
                className={`flex items-center gap-4 px-6 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200"
                }`}
              >
                <IconComponent
                  size={20}
                  className={`${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                  } transition-colors duration-200`}
                />
                <p className="font-medium text-sm">{item.text}</p>
              </Link>
            );
          })}
        </ul>
      </nav>

      <div className="flex-shrink-0 px-3 py-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4 px-6 py-3 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-200 text-gray-700 border border-transparent hover:border-gray-200">
          <User size={20} className="text-gray-500" />
          <p className="font-medium text-sm">Profile</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 rounded-lg hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-200 text-gray-700 border border-transparent hover:border-gray-200 mt-2">
          <Settings size={20} className="text-gray-500" />
          <p className="font-medium text-sm">Settings</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-3 rounded-lg hover:bg-red-50 hover:shadow-sm cursor-pointer transition-all duration-200 text-red-600 border border-transparent hover:border-red-200 mt-2"
        >
          <LogOut size={20} className="text-red-500" />
          <p className="font-medium text-sm">Logout</p>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
