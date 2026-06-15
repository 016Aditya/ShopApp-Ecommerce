import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

/**
 * ThemeProvider
 *
 * Must be rendered near the top of the tree (inside BrowserRouter is fine).
 * Calls initTheme() once on mount so the correct data-theme attribute is
 * set on <html> before the first paint, preventing any flash.
 *
 * No visible output — purely a side-effect component.
 */
const ThemeProvider = ({ children }) => {
  const initTheme = useThemeStore((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return <>{children}</>;
};

export default ThemeProvider;
