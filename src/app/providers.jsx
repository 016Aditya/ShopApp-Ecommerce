import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "@/features/cart/context/CartContext";
import ToastProvider from "@/components/common/ToastProvider";
import ThemeProvider from "@/components/common/ThemeProvider";

/**
 * Providers
 *
 * ThemeProvider is placed inside BrowserRouter so it can access router
 * context if needed, but outside CartProvider so the theme is applied
 * before any auth-gated page renders.
 *
 * AuthProvider removed — it was a no-op wrapper ({children}) around
 * Zustand's useAuthStore. Removing it eliminates one component wrapper
 * from every render without changing any behaviour.
 */
const Providers = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider>
      <CartProvider>
        <ToastProvider />
        {children}
      </CartProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default Providers;
