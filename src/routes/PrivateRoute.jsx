import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PATHS from './paths';

/**
 * PrivateRoute
 *
 * Guards authenticated pages.
 *
 * Critical fix: wait until Zustand persist has finished rehydrating
 * (`loading === true`) before making a redirect decision.
 * Without this wait, user=null on the first render after a page reload
 * causes an immediate redirect to /login even though the session is stored.
 *
 * Guard logic:
 *   loading  → render nothing (prevent flash-redirect)
 *   user     → render the protected page
 *   no user  → redirect to /login, preserve intended path in state
 */
const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return user
    ? <Outlet />
    : <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
};

export default PrivateRoute;
