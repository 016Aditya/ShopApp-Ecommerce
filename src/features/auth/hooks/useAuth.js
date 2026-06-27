/**
 * useAuth — canonical auth hook (Step 4)
 *
 * Single source of truth for auth state across the app.
 * Reads directly from useAuthStore (Zustand + persist middleware).
 *
 * Public surface:
 *   user        — authenticated user object or null
 *   token       — JWT string or null
 *   loading     — true during the rare Zustand persist hydration window
 *   error       — last auth error string or null
 *   login       — (credentials) => Promise<user>
 *   register    — (userData)    => Promise<user>
 *   logout      — () => void
 *   updateUser  — (partial)     => void  (local Zustand update only)
 *   clearError  — () => void
 *   isLoggedIn  — Boolean(user)
 *   isAdmin     — user.role === 'ADMIN'
 *
 * Named export: { useAuth }  — for hooks/routes that destructure
 * Default export: useAuth    — for Navbar and feature components
 */
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const store = useAuthStore();

  // _hydrated is set synchronously by onRehydrateStorage in authStore.js.
  // False only in the brief microtask window before Zustand reads localStorage.
  const loading = !store._hydrated;

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
