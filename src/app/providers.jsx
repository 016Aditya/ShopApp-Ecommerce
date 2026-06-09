import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/features/cart/context/CartContext";

const Providers = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>       {/* ← must be INSIDE AuthProvider so it can read user */}
        {children}
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default Providers;