import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <AdminHeader onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 lg:p-6 bg-gray-50 ">
          <Outlet /> {/* This will render admin pages */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;