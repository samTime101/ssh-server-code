//import React from "react";
import Header from "@/components/user/Header";
import Sidebar from "@/components/user/Sidebar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="ml-64 flex-1 p-6">
          {/* <QuestionBankSection /> */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
