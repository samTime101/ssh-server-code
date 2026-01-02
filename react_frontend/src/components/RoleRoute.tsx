import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";

interface RoleRouteProps {
  allowedRoles: string[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/auth/login" />;
  if (!user) return <Loader />;

  const hasRole = user.roles?.some((role: string) => allowedRoles.includes(role));

  return hasRole ? <Outlet /> : <Navigate to="/" />;
};

export default RoleRoute;
