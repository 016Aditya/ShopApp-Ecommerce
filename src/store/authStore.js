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
 *
 * Security note — registeredUsers:
 *   Only { email, phone } are stored. Passwords are NEVER written to localStorage.
 *   The backend /api/users/verify-identity endpoint validates identity using
 *   email + phoneNumber server-side; no client-side password check is needed.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:      null,
      token:     null,
      loading:   false,
      error:     null,
      _hydrated: false,

      /**
       * Local registry for Forgot-Password email+phone pre-fill.
       * Stores only { email, phone } — never credentials.
       */
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
           */
          const { token, user } = await loginService(credentials);

          // Normalise: guarantee user.id is always the string used for API calls.
          // Backend sends { id } from UserDto.Response, but guard against legacy
          // sessions that might still carry { _id } from pre-JWT responses.
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

          // Store only email + phone for the Forgot-Password flow pre-fill.
          // NEVER store the password — /api/users/verify-identity handles
          // identity verification server-side using email + phoneNumber.
          set((state) => ({
            loading: false,
            registeredUsers: [
              ...state.registeredUsers.filter((u) => u.email !== userData.email),
              {
                email: userData.email,
                phone: userData.phone ?? userData.phoneNumber ?? '',
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
          // Filter out any stale entries with a password field (migration safety)
          registeredUsers: state.registeredUsers.map((u) => {
            if (u.email !== email) return u;
            const { password: _removed, ...safe } = u; // strip password if present
            return { ...safe, ...partial };
          }),
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

          // Migration: strip any password field from registeredUsers
          // that may have been persisted by a previous version of this store.
          if (Array.isArray(state.registeredUsers)) {
            state.registeredUsers = state.registeredUsers.map(
              ({ password: _removed, ...safe }) => safe
            );
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
