import { useEffect } from "react";
import { useCartStore } from "@/store";
import { useAuth } from "@/context/AuthContext";

const useCart = () => {
  const { user } = useAuth();

  // Select each piece of state individually so Zustand only re-renders
  // this hook when those specific slices change.
  const items       = useCartStore((s) => s.items);
  const cartTotal   = useCartStore((s) => s.cartTotal);
  const loading     = useCartStore((s) => s.loading);
  const error       = useCartStore((s) => s.error);
  const initializeCart  = useCartStore((s) => s.initializeCart);
  const addToCart       = useCartStore((s) => s.addToCart);
  const updateQuantity  = useCartStore((s) => s.updateQuantity);
  const removeFromCart  = useCartStore((s) => s.removeFromCart);
  const clearCart       = useCartStore((s) => s.clearCart);
  const clearError      = useCartStore((s) => s.clearError);

  // Derive item count from the items array — no store method call needed.
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  useEffect(() => {
    initializeCart(user?.id ?? null);
  }, [user?.id, initializeCart]);

  return {
    items,
    cartTotal,
    loading,
    error,
    itemCount,
    totalItems: itemCount,

    // Actions
    addToCart,
    updateItem: updateQuantity,
    removeItem: removeFromCart,
    emptyCart: clearCart,

    // Utilities
    clearError,
  };
};

export default useCart;
