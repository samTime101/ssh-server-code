import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/user/Sidebar";
import { Outlet } from "react-router-dom";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { cn } from "@/lib/utils";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isCollapsed, toggleCollapse } = useSidebarCollapse("user");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
        <main
          className={cn(
            "min-w-0 flex-1 p-4 transition-all duration-300 ease-in-out md:p-6",
            isCollapsed ? "md:ml-16" : "md:ml-64"
          )}
        >
          <button
            onClick={toggleSidebar}
            className="text-muted-foreground hover:bg-muted mb-4 rounded-lg p-2 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
