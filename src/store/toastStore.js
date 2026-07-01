/**
 * toastStore.js — Global cart toast state (Zustand)
 *
 * Owned by the cart domain but lives in store/ because it is consumed
 * by both useCart (the mutation hook) and CartToastPortal (the renderer).
 *
 * API:
 *   showCartToast()  — called from useAddToCart onSuccess
 *   hideCartToast()  — called from CartToastPortal after animation
 *
 * Debounce: if showCartToast() is called while the toast is already
 * visible, it resets the auto-hide timer rather than stacking toasts.
 */
import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  visible: false,
  _hideTimer: null,

  showCartToast: () => {
    // Clear any running hide timer (debounce rapid clicks)
    const existing = get()._hideTimer;
    if (existing) clearTimeout(existing);

    // Show immediately
    set({ visible: true, _hideTimer: null });

    // Auto-hide after 2 s visible + 260 ms exit animation buffer
    const timer = setTimeout(() => {
      set({ visible: false, _hideTimer: null });
    }, 2260);

    set({ _hideTimer: timer });
  },

  hideCartToast: () => {
    const existing = get()._hideTimer;
    if (existing) clearTimeout(existing);
    set({ visible: false, _hideTimer: null });
  },
}));
