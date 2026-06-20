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
 * Auth state lives entirely here (Zustand + persist).
 * AuthContext is a thin re-export so existing imports keep working.
 *
 * Backend UserDto.Response shape (after latest backend fix):
 *   { id, firstName, lastName, email, phoneNumber, role, createdAt }
 *
 * The backend does NOT issue a JWT yet — the token field is null until
 * JWT middleware is added to the Spring Boot app.
 * PrivateRoute guards on `user !== null`, not on `token`.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:    null,
      token:   null,
      loading: false,
      error:   null,
      _hydrated: false,

      /** Local registry for Forgot-Password email+phone verification. */
      registeredUsers: [],

      setHydrated: () => set({ _hydrated: true }),

      isLoggedIn: () => !!get().user,
      isAdmin:    () => get().user?.role === 'ADMIN',

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await loginService(credentials);
          /**
           * Backend returns a flat UserDto.Response:
           *   { id, firstName, lastName, email, phoneNumber, role, createdAt }
           *
           * Normalise: guarantee `id` is always the string we use for API calls.
           * Some Spring Boot versions may serialise the Mongo id as `_id`;
           * we unify it here so `user.id` is always defined.
           */
          const normalised = {
            ...data,
            id: data.id ?? data._id,
          };
          set({
            user:    normalised,
            token:   normalised.token ?? null,
            loading: false,
          });
          return normalised;
        } catch (err) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

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

      logout: () => {
        logoutService();
        set({ user: null, token: null });
      },

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
        /**
         * Also normalise `id` on rehydration so that users who were
         * logged in before the backend fix (and have stale localStorage)
         * still get a valid user.id after a page refresh.
         */
        if (state) {
          if (state.user && !state.user.id && state.user._id) {
            state.user = { ...state.user, id: state.user._id };
          }
          state.setHydrated();
        }
      },
    }
  )
);
