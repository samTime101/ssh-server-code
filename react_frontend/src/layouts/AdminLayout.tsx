import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-slate-900">
          <Outlet /> {/* This will render admin pages */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;