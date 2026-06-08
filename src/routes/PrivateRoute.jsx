import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import useAuth from "@/features/auth/hooks/useAuth";

function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to={PATHS.LOGIN} replace />;
}

export default PrivateRoute;