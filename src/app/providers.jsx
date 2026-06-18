import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/features/cart/context/CartContext";
import ToastProvider from "@/components/common/ToastProvider";
import ThemeProvider from "@/components/common/ThemeProvider";

/**
 * Providers
 *
 * ThemeProvider is placed inside BrowserRouter so it can access router
 * context if needed, but outside AuthProvider so the theme is applied
 * before any auth-gated page renders. This prevents the flash-of-wrong-
 * theme on protected routes.
 *
 * ThemeProvider calls initTheme() on mount, which reads from Zustand
 * persist (localStorage key: "theme-preference") and applies the correct
 * data-theme attribute to <html> immediately.
 */
const Providers = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider />
          {children}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default Providers;
