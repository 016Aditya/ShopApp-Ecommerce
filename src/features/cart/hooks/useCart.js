import { useEffect, useRef } from "react";
import { useCartStore } from "@/store";
import { useAuth } from "@/context/AuthContext";

const useCart = () => {
  const { user } = useAuth();

  // ── State slices (reactive) ───────────────────────────────────────────
  const items     = useCartStore((s) => s.items);
  const cartTotal = useCartStore((s) => s.cartTotal);
  const loading   = useCartStore((s) => s.loading);
  const error     = useCartStore((s) => s.error);

  // Derived count — pure computation, no store call
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  // ── Initialize cart ONCE per user change ─────────────────────────────
  // useRef tracks the last userId we already initialized for.
  // This ensures initializeCart never runs more than once per userId,
  // regardless of how many times this hook or its parent re-renders.
  const initializedForRef = useRef(null);

  useEffect(() => {
    const uid = user?.id ?? null;
    if (uid === initializedForRef.current) return; // already initialized for this user
    initializedForRef.current = uid;
    // Get action directly from store — stable reference, never goes stale
    useCartStore.getState().initializeCart(uid);
  }, [user?.id]);

  // ── Actions via getState() — stable, never cause re-renders ──────────
  return {
    items,
    cartTotal,
    loading,
    error,
    itemCount,
    totalItems: itemCount,

    addToCart:  (productId, qty = 1) => useCartStore.getState().addToCart(productId, qty),
    updateItem: (productId, qty)     => useCartStore.getState().updateQuantity(productId, qty),
    removeItem: (productId)          => useCartStore.getState().removeFromCart(productId),
    emptyCart:  ()                   => useCartStore.getState().clearCart(),
    refreshCart: ()                  => useCartStore.getState().refreshCart(),
    clearError: ()                   => useCartStore.getState().clearError(),
  };
};

export default useCart;
