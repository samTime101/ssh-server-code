import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isCollapsed, toggleCollapse } = useSidebarCollapse("admin");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        <AdminHeader onMenuClick={toggleSidebar} />
        <main className="bg-background min-w-0 flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
