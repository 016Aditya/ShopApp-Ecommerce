/**
 * toastStore.js — Global toast state (Zustand)
 *
 * Manages two independent toast channels:
 *   cart     — green "✓ Added to Cart!"  (showCartToast)
 *   wishlist — pink  "❤️ Added to Wishlist!" / "💔 Removed from Wishlist!"
 *              (showWishlistToast(type))  type: 'add' | 'remove'
 *
 * Each channel is independent: both can be visible simultaneously
 * (e.g. add to cart AND wishlist in rapid succession).
 *
 * Debounce: calling show* while already visible resets the hide timer
 * instead of stacking multiple toasts.
 */
import { create } from 'zustand';

const AUTO_HIDE_MS = 2260; // 2 s visible + 260 ms exit-animation buffer

export const useToastStore = create((set, get) => ({
  // ── Cart toast ──────────────────────────────────────────────────────
  cartVisible: false,
  _cartTimer: null,

  showCartToast: () => {
    const existing = get()._cartTimer;
    if (existing) clearTimeout(existing);
    set({ cartVisible: true, _cartTimer: null });
    const timer = setTimeout(() => set({ cartVisible: false, _cartTimer: null }), AUTO_HIDE_MS);
    set({ _cartTimer: timer });
  },

  hideCartToast: () => {
    const existing = get()._cartTimer;
    if (existing) clearTimeout(existing);
    set({ cartVisible: false, _cartTimer: null });
  },

  // ── Wishlist toast ──────────────────────────────────────────────────
  // type: 'add' | 'remove'
  wishlistVisible: false,
  wishlistType: 'add',
  _wishlistTimer: null,

  showWishlistToast: (type = 'add') => {
    const existing = get()._wishlistTimer;
    if (existing) clearTimeout(existing);
    set({ wishlistVisible: true, wishlistType: type, _wishlistTimer: null });
    const timer = setTimeout(
      () => set({ wishlistVisible: false, _wishlistTimer: null }),
      AUTO_HIDE_MS
    );
    set({ _wishlistTimer: timer });
  },

  hideWishlistToast: () => {
    const existing = get()._wishlistTimer;
    if (existing) clearTimeout(existing);
    set({ wishlistVisible: false, _wishlistTimer: null });
  },
}));
