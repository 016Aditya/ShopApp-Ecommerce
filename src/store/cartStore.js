import { create } from 'zustand';

/**
 * cartStore — Zustand (UI flags only, NO async API calls)
 *
 * Ownership boundary after refactor:
 *   Zustand  →  ephemeral client-side UI state (drawer open/close, optimistic
 *               item snapshots for instant feedback before the server responds)
 *   TanStack →  ALL cart server-state: fetching, mutations, cache invalidation
 *
 * Why this split?
 *   The old cartStore mixed async API calls with UI state. On a 401 response
 *   the Axios interceptor cleared localStorage and redirected to /login, but
 *   cartStore's own catch blocks tried to set error state on the now-unmounted
 *   tree, triggering re-renders that fired more requests → infinite loop.
 *
 *   By removing all network logic from Zustand, the 401 path is now handled
 *   exclusively by the Axios interceptor (api.js) and the useCart TanStack
 *   Query hooks (which call authStore.logout() on 401). Zustand never touches
 *   the network and therefore never races the interceptor.
 */
export const useCartStore = create((set, get) => ({
  // ── UI flags ────────────────────────────────────────────────────────────

  /** Whether the slide-out cart drawer is open. */
  isCartOpen: false,

  openCart:  () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

  // ── Optimistic snapshot ─────────────────────────────────────────────────
  // A lightweight local copy of items written immediately when the user
  // clicks "Add to Cart" so the UI responds instantly while the mutation
  // is in-flight. Cleared once TanStack Query's onSettled fires.
  //
  // Shape: [{ productId, quantity, unitPrice, productName, imageUrl }]
  optimisticItems: [],

  /**
   * Add or increment an item in the optimistic snapshot.
   * Called by useAddToCart mutation before the network request fires.
   */
  addOptimistic: (product, quantity = 1) => {
    const { optimisticItems } = get();
    const existing = optimisticItems.find((i) => i.productId === product.id);
    if (existing) {
      set({
        optimisticItems: optimisticItems.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        ),
      });
    } else {
      set({
        optimisticItems: [
          ...optimisticItems,
          {
            productId:   product.id,
            quantity,
            unitPrice:   product.price ?? product.unitPrice ?? 0,
            productName: product.name  ?? product.productName ?? '',
            imageUrl:    product.imageUrl ?? '',
            brand:       product.brand ?? '',
            category:    product.category ?? '',
          },
        ],
      });
    }
  },

  /** Remove one item from the optimistic snapshot (e.g. on remove mutation). */
  removeOptimistic: (productId) =>
    set((s) => ({
      optimisticItems: s.optimisticItems.filter((i) => i.productId !== productId),
    })),

  /** Clear the entire optimistic snapshot — call this from onSettled. */
  clearOptimistic: () => set({ optimisticItems: [] }),
}));
