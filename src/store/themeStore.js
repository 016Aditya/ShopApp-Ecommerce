import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_THEME = "light";

const applyTheme = (theme) => {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0f1115" : "#f4f6f8");
    }
  }
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: null,

      get resolvedTheme() {
        return get().theme ?? DEFAULT_THEME;
      },

      toggleTheme: () => {
        const next = (get().theme ?? DEFAULT_THEME) === "light" ? "dark" : "light";
        applyTheme(next);
        set({ theme: next });
      },

      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },

      initTheme: () => {
        applyTheme(get().theme ?? DEFAULT_THEME);
      },
    }),
    {
      name: "theme-preference",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
