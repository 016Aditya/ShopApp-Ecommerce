import { create } from 'zustand';

/**
 * wishlistStore — Zustand (UI flags only, NO server state)
 *
 * Ownership boundary after TanStack migration:
 *   Zustand  →  ephemeral client-side UI state (drawer open/close)
 *   TanStack →  ALL wishlist server-state: fetching, mutations, cache
 *
 * Server state (items, add, remove) lives in:
 *   src/features/wishlist/hooks/useWishlist.js
 *
 * This mirrors the same pattern as cartStore after its refactor.
 */
export const useWishlistStore = create((set) => ({
  // ── UI flags ────────────────────────────────────────────────────────────

  /** Whether the slide-out wishlist drawer is open (if you add one). */
  isWishlistOpen: false,

  openWishlist:  () => set({ isWishlistOpen: true }),
  closeWishlist: () => set({ isWishlistOpen: false }),
  toggleWishlist: () => set((s) => ({ isWishlistOpen: !s.isWishlistOpen })),
}));
