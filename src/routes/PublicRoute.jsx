import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import useAuth from "@/features/auth/hooks/useAuth";

function PublicRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to={PATHS.HOME} replace /> : <Outlet />;
}

export default PublicRoute;