import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PATHS from "./paths";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user
    ? <Navigate to={PATHS.HOME} replace />
    : <Outlet />;
};

export default PublicRoute;