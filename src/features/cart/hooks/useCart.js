import { useEffect } from "react";
import { useCartStore } from "@/store";
import { useAuth } from "@/context/AuthContext";

const useCart = () => {
  const { user } = useAuth();
  const cartStore = useCartStore();

  // Initialize cart when user logs in
  useEffect(() => {
    if (user?.id) {
      cartStore.initializeCart(user.id);
    } else {
      cartStore.initializeCart(null);
    }
  }, [user?.id, cartStore]);

  return {
    items: cartStore.items,
    cartTotal: cartStore.cartTotal,
    loading: cartStore.loading,
    error: cartStore.error,
    itemCount: cartStore.getItemCount(),
    totalItems: cartStore.getItemCount(),

    // Actions
    addToCart: cartStore.addToCart,
    updateItem: cartStore.updateQuantity,
    removeItem: cartStore.removeFromCart,
    emptyCart: cartStore.clearCart,

    // Utilities
    clearError: cartStore.clearError,
  };
};

export default useCart;