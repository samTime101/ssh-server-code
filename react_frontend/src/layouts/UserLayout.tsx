import { useState } from "react";
import { Menu } from "lucide-react";
import Header from "@/components/user/Header";
import Sidebar from "@/components/user/Sidebar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className="flex-1 p-4 md:ml-64 md:p-6">
          <button
            onClick={toggleSidebar}
            className="text-muted-foreground hover:bg-muted mb-4 rounded-lg p-2 md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>
          {/* <QuestionBankSection /> */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
