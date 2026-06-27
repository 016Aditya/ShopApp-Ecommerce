import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import PATHS from './paths';

/**
 * PrivateRoute
 *
 * Guards authenticated pages.
 *
 * Fix: instead of `return null` during Zustand persist hydration (which
 * produces a full-page white flash), we render a minimal themed skeleton bar
 * that keeps the Navbar and Footer visible while the auth state resolves.
 *
 * Guard logic:
 *   loading  → render themed skeleton bar (no white flash)
 *   user     → render the protected page
 *   no user  → redirect to /login, preserve intended path in state
 */
const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="flex-1 w-full"
        style={{ backgroundColor: 'var(--bg-primary)' }}
        aria-busy="true"
        aria-label="Loading…"
      >
        {/* Subtle shimmer bar — Navbar + Footer remain fully visible */}
        <div
          style={{
            height: 3,
            width: '100%',
            background:
              'linear-gradient(90deg, var(--bg-primary) 0%, var(--accent, #ff9f00) 50%, var(--bg-primary) 100%)',
            backgroundSize: '200% 100%',
            animation: 'sk-shimmer 1.2s ease-in-out infinite',
          }}
        />
      </div>
    );
  }

  return user
    ? <Outlet />
    : <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
};

export default PrivateRoute;
