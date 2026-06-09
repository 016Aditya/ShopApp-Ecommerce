import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import PATHS from "./paths";

const PublicRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return user
    ? <Navigate to={PATHS.HOME} replace />
    : <Outlet />;
};

export default PublicRoute;