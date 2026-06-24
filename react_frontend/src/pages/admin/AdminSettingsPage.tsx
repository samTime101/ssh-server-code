import React from "react";
import AppearanceSection from "@/components/AppearanceSection";

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      <h1 className="text-foreground text-2xl font-semibold">Settings</h1>
      <AppearanceSection />
    </div>
  );
};

export default AdminSettingsPage;
