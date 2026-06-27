import { BrowserRouter } from 'react-router-dom';
import ToastProvider from '@/components/common/ToastProvider';
import ThemeProvider from '@/components/common/ThemeProvider';

/**
 * Providers
 *
 * ThemeProvider is placed inside BrowserRouter so it can access router
 * context if needed.
 *
 * Removed wrappers (no longer needed):
 *   AuthProvider  — was a no-op shell around Zustand's useAuthStore.
 *   CartProvider  — legacy React context deleted; cart server-state is
 *                   owned by TanStack Query (QueryClientProvider lives
 *                   in main.jsx, no extra wrapper required here).
 */
const Providers = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <ToastProvider />
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

export default Providers;
