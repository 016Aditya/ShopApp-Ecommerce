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
 * Response shape from backend (UserDto.Response):
 *   { id, firstName, lastName, email, role, createdAt }
 *
 * The backend does NOT issue a JWT yet — the token field is null until
 * JWT middleware is added to the Spring Boot app.
 * PrivateRoute guards on `user !== null`, not on `token`.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
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
           *   { id, firstName, lastName, email, role, createdAt }
           *
           * There is no `user` wrapper and no `token` field yet.
           * We store the whole object as `user`.
           */
          set({
            user:    data,
            token:   data.token ?? null,   // null until backend issues JWT
            loading: false,
          });
          return data;
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
                email:       userData.email,
                phone:       userData.phone ?? userData.phoneNumber ?? '',
                password:    userData.password,
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
        // Mark store as hydrated after persist has restored data.
        // AuthContext reads _hydrated to avoid flash-redirect on reload.
        if (state) state.setHydrated();
      },
    }
  )
);
