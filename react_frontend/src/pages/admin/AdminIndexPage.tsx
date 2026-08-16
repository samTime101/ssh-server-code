import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ROLE_CONFIG from "@/config/roleConfig";
import Loader from "@/components/ui/Loader";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";

/**
 * Admin index: show dashboard when permitted, otherwise land on add-question
 * so non-admin staff are not bounced in a / <-> /admin loop.
 */
const AdminIndexPage = () => {
  const { user } = useAuth();

  if (!user) return <Loader />;

  const hasDashboard = user.roles?.some((role: string) =>
    ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]?.includes("dashboard")
  );

  if (hasDashboard) return <AdminDashboardPage />;

  return <Navigate to="/admin/add-question" replace />;
};

export default AdminIndexPage;
