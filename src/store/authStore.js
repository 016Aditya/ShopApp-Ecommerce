import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from '@/services/authService';

/**
 * authStore
 *
 * Auth state lives here (Zustand + persist).
 * AuthContext is a thin re-export so existing imports keep working.
 *
 * Backend LoginResponse shape (after JWT implementation):
 *   {
 *     token: "<signed JWT>",
 *     user:  { id, firstName, lastName, email, phoneNumber, role, createdAt }
 *   }
 *
 * The JWT token is stored in:
 *   1. Zustand state (token field) — persisted to localStorage via zustand/persist
 *   2. localStorage['auth_token']  — direct write for the Axios interceptor to
 *      read during the brief pre-hydration window on page reload
 *
 * PrivateRoute guards on `user !== null`.
 * Axios interceptor guards on `token` (Zustand store → localStorage fallback).
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:      null,
      token:     null,
      loading:   false,
      error:     null,
      _hydrated: false,

      /** Local registry for Forgot-Password email+phone verification. */
      registeredUsers: [],

      setHydrated: () => set({ _hydrated: true }),

      isLoggedIn: () => !!get().user,
      isAdmin:    () => get().user?.role === 'ADMIN',

      // ── Login ────────────────────────────────────────────────────────────────
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          /**
           * loginService returns the full backend LoginResponse:
           *   { token: string, user: UserDto.Response }
           *
           * We destructure them separately so the store fields are correct
           * and the Axios interceptor always has the JWT it needs.
           */
          const { token, user } = await loginService(credentials);

          // Normalise: guarantee user.id is always the string used for API calls
          const normalisedUser = {
            ...user,
            id: user.id ?? user._id,
          };

          // Write token to localStorage directly so the Axios interceptor can
          // read it immediately on the next request, before Zustand rehydrates.
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(normalisedUser));

          set({
            user:    normalisedUser,
            token,
            loading: false,
          });

          return normalisedUser;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      // ── Register ─────────────────────────────────────────────────────────────
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const data = await registerService(userData);
          set((state) => ({
            loading: false,
            registeredUsers: [
              ...state.registeredUsers.filter((u) => u.email !== userData.email),
              {
                email:    userData.email,
                phone:    userData.phone ?? userData.phoneNumber ?? '',
                password: userData.password,
              },
            ],
          }));
          return data;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      // ── Logout ───────────────────────────────────────────────────────────────
      logout: () => {
        logoutService();                          // clears localStorage auth_token + auth_user
        set({ user: null, token: null });
      },

      // ── Helpers ──────────────────────────────────────────────────────────────
      updateUser: (partial) =>
        set((state) => ({ user: { ...state.user, ...partial } })),

      updateRegisteredUser: (email, partial) =>
        set((state) => ({
          registeredUsers: state.registeredUsers.map((u) =>
            u.email === email ? { ...u, ...partial } : u
          ),
        })),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        registeredUsers: state.registeredUsers,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Normalise user.id from stale localStorage (pre-JWT sessions)
          if (state.user && !state.user.id && state.user._id) {
            state.user = { ...state.user, id: state.user._id };
          }
          // Keep localStorage auth_token in sync with the rehydrated Zustand token
          if (state.token) {
            localStorage.setItem('auth_token', state.token);
          } else {
            localStorage.removeItem('auth_token');
          }
          state.setHydrated();
        }
      },
    }
  )
);
