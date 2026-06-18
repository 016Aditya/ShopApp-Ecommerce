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
 * Changes vs. original:
 * - `registeredUsers` array tracks locally-registered users so ForgotPassword
 *   can verify email + phone without a backend endpoint.
 * - `updateRegisteredUser` patches a user entry (used by ResetPassword).
 * - `phone` is added to the register payload and stored alongside the user.
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      /** Local registry — email + phone + password index for recovery flow. */
      registeredUsers: [],

      isLoggedIn: () => !!get().user,
      isAdmin:    () => get().user?.role === 'ADMIN',

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await loginService(credentials);
          set({ user: data.user, token: data.token, loading: false });
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
          // Store phone alongside email for recovery verification
          set((state) => ({
            loading: false,
            registeredUsers: [
              ...state.registeredUsers.filter((u) => u.email !== userData.email),
              { email: userData.email, phone: userData.phone ?? "", password: userData.password },
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

      /** Patch a registered user entry — used by ResetPassword to update password. */
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
        user:             state.user,
        token:            state.token,
        registeredUsers:  state.registeredUsers,
      }),
    }
  )
);
