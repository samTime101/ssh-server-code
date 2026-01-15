import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ROLE_CONFIG from "@/config/roleConfig";
import Loader from "@/components/ui/Loader";

interface RoleRouteProps {
  allowedPermissions: string[];
}

const RoleRoute = ({ allowedPermissions }: RoleRouteProps) => {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/auth/login" />;
  if (!user) return <Loader />;

  // Check if user has a role that includes ALL required permissions
  const hasAccess = user?.roles?.some((role: string) =>
    allowedPermissions.every((perm) => ROLE_CONFIG[role as keyof typeof ROLE_CONFIG]?.includes(perm))
  );

  return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
};

export default RoleRoute;
