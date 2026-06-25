import { useEffect } from 'react';
import { useThemeStore, applyTheme } from '@/store/themeStore';

/**
 * ThemeProvider
 *
 * Applies the correct data-theme attribute to <html> on mount and whenever
 * the persisted theme changes. Rendering is purely a side-effect — no output.
 *
 * Boot sequence:
 *   1. index.html inline <script>  → sets data-theme + bg-color (~0ms, pre-paint)
 *   2. main.jsx initThemeEarly()   → redundant safety call via Zustand read
 *   3. ThemeProvider useEffect     → adds .theme-ready class to enable body
 *                                    transition for the theme toggle button
 *
 * The .theme-ready class on <html> gates the body background-color transition
 * so it only activates after React has mounted (not during startup).
 */
const ThemeProvider = ({ children }) => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    // Keep <html data-theme> in sync when the user toggles
    applyTheme(theme);
    // Enable transition now that React has mounted — prevents startup flash
    document.documentElement.classList.add('theme-ready');
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
