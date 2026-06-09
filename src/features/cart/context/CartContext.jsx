import { createContext, useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "@/context/AuthContext";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} from "@/services/cartService";

const CartContext = createContext(null);
export default CartContext;

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [cart, setCart]       = useState(null);   // full cart object from backend
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // ── Derived values ──────────────────────────────────────────────────────
  const items      = cart?.items      ?? [];
  const cartTotal  = cart?.cartTotal  ?? 0;
  const itemCount  = items.reduce((sum, i) => sum + i.quantity, 0);

  // ── Fetch cart whenever user logs in ────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCart(user.id);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchCart();
    } else {
      setCart(null); // clear cart on logout
    }
  }, [user?.id, fetchCart]);

  // ── Actions ─────────────────────────────────────────────────────────────
  const addToCart = async (productId, quantity = 1) => {
    if (!user?.id) return;
    try {
      const data = await addItemToCart(user.id, productId, quantity);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add item");
    }
  };

  const updateItem = async (productId, quantity) => {
    if (!user?.id) return;
    try {
      const data = await updateCartItem(user.id, productId, quantity);
      setCart(data);
      // backend removes item automatically when quantity <= 0
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item");
    }
  };

  const removeItem = async (productId) => {
    if (!user?.id) return;
    try {
      const data = await removeItemFromCart(user.id, productId);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove item");
    }
  };

  const emptyCart = async () => {
    if (!user?.id) return;
    try {
      await clearCart(user.id);
      setCart((prev) => ({ ...prev, items: [], cartTotal: 0 }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to clear cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        cartTotal,
        itemCount,
        loading,
        error,
        addToCart,
        updateItem,
        removeItem,
        emptyCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};