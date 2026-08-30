import { Navigate, Outlet } from "react-router-dom";
import { isPlatformHost } from "@/config/tenant";

const PlatformRoute = () => {
  return isPlatformHost() ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default PlatformRoute;
