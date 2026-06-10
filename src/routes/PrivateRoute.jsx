import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PATHS from "./paths";

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return user
    ? <Outlet />
    : <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
};

export default PrivateRoute;
