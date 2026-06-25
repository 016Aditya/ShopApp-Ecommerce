/**
 * AuthContext
 *
 * Thin wrapper around useAuthStore so every component that calls
 * useAuth() continues to work without import changes.
 *
 * Hydration loading:
 * Zustand's onRehydrateStorage fires synchronously during the same
 * microtask as localStorage reads (no network involved). By the time
 * React renders the first component tree, _hydrated is already true
 * in almost all cases. We keep the loading flag for the rare edge case
 * where it isn't yet, but avoid the expensive subscribe/polling pattern.
 */
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const store = useAuthStore();

  // _hydrated is set synchronously by onRehydrateStorage in authStore.js.
  // Using it directly (no extra useState/useEffect) means:
  //   - zero extra renders on initial mount
  //   - no subscribe() overhead
  //   - loading is false on the very first render in the vast majority of cases
  const loading = !store._hydrated;

  return {
    user:        store.user,
    token:       store.token,
    loading,
    error:       store.error,
    login:       store.login,
    register:    store.register,
    logout:      store.logout,
    updateUser:  store.updateUser,
    clearError:  store.clearError,
    isLoggedIn:  store.isLoggedIn,
    isAdmin:     store.isAdmin,
  };
};

// AuthProvider is a no-op shell — Zustand needs no React provider
export function AuthProvider({ children }) {
  return <>{children}</>;
}
