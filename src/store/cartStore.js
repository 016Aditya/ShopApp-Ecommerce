import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} from '@/services/cartService';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      cartTotal: 0,
      loading: false,
      error: null,
      userId: null,

      // ── Initialize cart from API ──────────────────────────────────────
      initializeCart: async (userId) => {
        if (!userId) {
          set({ userId: null, items: [], cartTotal: 0 });
          return;
        }

        set({ userId, loading: true, error: null });
        try {
          const data = await getCart(userId);
          set({
            items: data.items || [],
            cartTotal: data.cartTotal || 0,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to load cart',
            loading: false,
          });
        }
      },

      // ── Add item to cart ──────────────────────────────────────────────
      addToCart: async (productId, quantity = 1) => {
        const { userId } = get();
        if (!userId) return;

        set({ loading: true, error: null });
        try {
          const data = await addItemToCart(userId, productId, quantity);
          set({
            items: data.items || [],
            cartTotal: data.cartTotal || 0,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to add item',
            loading: false,
          });
        }
      },

      // ── Update item quantity ──────────────────────────────────────────
      updateQuantity: async (productId, quantity) => {
        const { userId } = get();
        if (!userId) return;

        set({ loading: true, error: null });
        try {
          const data = await updateCartItem(userId, productId, quantity);
          set({
            items: data.items || [],
            cartTotal: data.cartTotal || 0,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to update item',
            loading: false,
          });
        }
      },

      // ── Remove item from cart ─────────────────────────────────────────
      removeFromCart: async (productId) => {
        const { userId } = get();
        if (!userId) return;

        set({ loading: true, error: null });
        try {
          const data = await removeItemFromCart(userId, productId);
          set({
            items: data.items || [],
            cartTotal: data.cartTotal || 0,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to remove item',
            loading: false,
          });
        }
      },

      // ── Clear entire cart ─────────────────────────────────────────────
      clearCart: async () => {
        const { userId } = get();
        if (!userId) return;

        set({ loading: true, error: null });
        try {
          await clearCart(userId);
          set({
            items: [],
            cartTotal: 0,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to clear cart',
            loading: false,
          });
        }
      },

      // ── Derived state ─────────────────────────────────────────────────
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      // ── Reset error ───────────────────────────────────────────────────
      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        items: state.items,
        cartTotal: state.cartTotal,
      }),
    }
  )
);
