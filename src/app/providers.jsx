import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/features/cart/context/CartContext";
import ToastProvider from "@/components/common/ToastProvider";

const Providers = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <ToastProvider />
        {children}
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default Providers;