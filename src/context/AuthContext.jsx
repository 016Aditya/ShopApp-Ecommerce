/**
 * AuthContext — thin wrapper around useAuthStore.
 *
 * State now lives entirely in Zustand (authStore) with persist middleware.
 * This file is kept so existing components using useAuth() continue to work
 * without any import changes.
 */
import { useAuthStore } from '@/store/authStore';

// Re-export the store hook under the familiar useAuth name
export const useAuth = () => useAuthStore();

// AuthProvider is now a no-op shell — Zustand needs no React provider
export function AuthProvider({ children }) {
  return <>{children}</>;
}
