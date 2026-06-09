import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import PATHS from "./paths";

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null; // or a full-page spinner

  return user
    ? <Outlet />
    : <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
};

export default PrivateRoute;