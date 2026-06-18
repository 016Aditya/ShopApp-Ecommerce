import { useEffect } from 'react';
import { useThemeStore, applyTheme } from '@/store/themeStore';

/**
 * ThemeProvider
 *
 * Applies the correct data-theme attribute to <html> on mount and whenever
 * the persisted theme changes. Rendering is purely a side-effect — no output.
 *
 * The early init (main.jsx → initThemeEarly) handles the very first paint;
 * this component keeps subsequent renders in sync (e.g. after hydration).
 */
const ThemeProvider = ({ children }) => {
  const theme = useThemeStore((s) => s.theme);

  // Sync the <html> attribute whenever the Zustand value changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
