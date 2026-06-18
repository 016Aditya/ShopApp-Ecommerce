import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginService, register as registerService, logout as logoutService } from '@/services/authService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      // Derived helpers
      isLoggedIn: () => !!get().user,
      isAdmin: () => get().user?.role === 'ADMIN',

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
          set({ loading: false });
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

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // key in localStorage
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
