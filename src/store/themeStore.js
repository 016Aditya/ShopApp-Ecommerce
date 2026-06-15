import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Detect the OS/browser colour scheme preference.
 * Returns 'dark' | 'light'
 */
const getSystemTheme = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

/**
 * Apply the theme to the <html> element so CSS variables cascade
 * to every element on the page without needing a React context re-render.
 */
const applyTheme = (theme) => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
    // Keep meta theme-color in sync for mobile browsers
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        'content',
        theme === 'dark' ? '#0f0f11' : '#ffffff'
      );
    }
  }
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      // null means "not yet chosen by user" → fall back to system
      theme: null,

      // Resolved theme always has a concrete value
      get resolvedTheme() {
        return get().theme ?? getSystemTheme();
      },

      toggleTheme: () => {
        const next =
          (get().theme ?? getSystemTheme()) === 'light' ? 'dark' : 'light';
        applyTheme(next);
        set({ theme: next });
      },

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      // Call once on app mount to sync DOM with persisted preference
      initTheme: () => {
        const stored = get().theme;
        const resolved = stored ?? getSystemTheme();
        applyTheme(resolved);

        // Listen for OS preference changes only when user hasn't overridden
        if (typeof window !== 'undefined') {
          window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
              if (!get().theme) {
                applyTheme(e.matches ? 'dark' : 'light');
              }
            });
        }
      },
    }),
    {
      name: 'theme-preference',
      // Only persist the explicit user choice (null = system default)
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
