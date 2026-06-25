import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PATHS from './paths';

/**
 * PublicRoute
 *
 * Blocks already-authenticated users from reaching /login and /register.
 *
 * Fix: instead of `return null` during Zustand persist hydration (which
 * produces a full-page white flash), we render a minimal themed skeleton bar
 * that keeps the Navbar and Footer visible while the auth state resolves.
 *
 * Guard logic:
 *   loading  → render themed skeleton bar (no white flash)
 *   user     → redirect to home
 *   no user  → render the public page
 */
const PublicRoute = () => {
  const { user, loading } = useAuth();

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
    ? <Navigate to={PATHS.HOME} replace />
    : <Outlet />;
};

export default PublicRoute;
