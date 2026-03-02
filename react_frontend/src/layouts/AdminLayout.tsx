import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="bg-background flex min-h-screen">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        <AdminHeader onMenuClick={toggleSidebar} />
        <main className="bg-background flex-1 p-4 lg:p-6">
          <Outlet /> {/* This will render admin pages */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
