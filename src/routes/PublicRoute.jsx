import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PATHS from './paths';

/**
 * PublicRoute
 *
 * Blocks already-authenticated users from reaching /login and /register.
 *
 * Critical fix: same hydration guard as PrivateRoute — wait for Zustand
 * persist to finish before making a redirect decision.
 * Without this, a logged-in user who reloads the page while on /login
 * sees a flash of the login form before being redirected.
 *
 * Guard logic:
 *   loading  → render nothing (prevent flash-redirect)
 *   user     → redirect to home
 *   no user  → render the public page
 */
const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user
    ? <Navigate to={PATHS.HOME} replace />
    : <Outlet />;
};

export default PublicRoute;
