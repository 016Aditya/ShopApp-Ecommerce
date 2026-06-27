/**
 * useAuth — canonical auth hook
 *
 * Single source of truth for auth state across the app.
 * Reads from useAuthStore (Zustand + persist middleware).
 *
 * Public surface:
 *   user        — authenticated user object or null
 *   token       — JWT string or null
 *   loading     — true ONLY during the Zustand persist hydration window
 *   error       — last auth error string or null
 *   login       — (credentials) => Promise<user>
 *   register    — (userData)    => Promise<user>
 *   logout      — () => void
 *   updateUser  — (partial)     => void
 *   clearError  — () => void
 *   isLoggedIn  — Boolean(user)
 *   isAdmin     — user.role === 'ADMIN'
 *
 * Named export: { useAuth }  — for hooks/routes that destructure
 * Default export: useAuth    — for Navbar and feature components
 *
 * --- WHY hasHydrated() instead of _hydrated flag ---
 * _hydrated was set inside onRehydrateStorage via state.setHydrated().
 * That callback receives a state *snapshot*, not the live store — calling
 * set() on it doesn't update the real Zustand state, so _hydrated stayed
 * false forever on fresh sessions → loading was always true → PublicRoute
 * never redirected after login → infinite /login loop.
 *
 * useAuthStore.persist.hasHydrated() is the official Zustand API:
 * it returns true once the persist middleware finishes reading localStorage,
 * regardless of whether anything was stored. No manual flag needed.
 */
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const store = useAuthStore();

  // Official Zustand persist API — always resolves correctly.
  // Falls back to true (not loading) when persist middleware is absent.
  const loading = !(useAuthStore.persist?.hasHydrated?.() ?? true);

  return {
    user:       store.user,
    token:      store.token,
    loading,
    error:      store.error,
    login:      store.login,
    register:   store.register,
    logout:     store.logout,
    updateUser: store.updateUser,
    clearError: store.clearError,
    isLoggedIn: store.isLoggedIn,
    isAdmin:    store.isAdmin,
  };
}

export default useAuth;
