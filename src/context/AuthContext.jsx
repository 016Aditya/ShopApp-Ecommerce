/**
 * AuthContext
 *
 * Thin wrapper around useAuthStore so every component that calls
 * useAuth() continues to work without import changes.
 *
 * Key fix: expose a stable `loading` boolean that is `true` until
 * Zustand persist has finished rehydrating from localStorage.
 * Without this, PrivateRoute / PublicRoute both see user=null on
 * the first render after a page reload and immediately redirect to
 * /login — even when a session is stored.
 */
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const store = useAuthStore();

  /**
   * `_hydrated` is set to true by onRehydrateStorage in authStore.
   * We mirror it as a local `loading` flag so route guards can wait.
   */
  const [loading, setLoading] = useState(!store._hydrated);

  useEffect(() => {
    if (store._hydrated) {
      setLoading(false);
      return;
    }
    // Poll until hydration completes (usually < 1 frame)
    const unsub = useAuthStore.subscribe(
      (s) => s._hydrated,
      (hydrated) => {
        if (hydrated) setLoading(false);
      }
    );
    return unsub;
  }, [store._hydrated]);

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
