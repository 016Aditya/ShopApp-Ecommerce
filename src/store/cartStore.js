import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} from '@/services/cartService';

// ── Cart item shape (enriched) ──────────────────────────────────────────────
// Backend CartItem only stores: { productId, quantity, unitPrice }
// We enrich at add-time by snapshotting the product object so the
// cart UI can display name / image / brand / category without extra API calls.
//
// Stored shape:
//   { productId, quantity, unitPrice, productName, imageUrl, brand, category }

const enrichItem = (apiItem, productSnapshot) => ({
  productId:   apiItem.productId,
  quantity:    apiItem.quantity,
  unitPrice:   apiItem.unitPrice ?? productSnapshot?.unitPrice ?? productSnapshot?.price ?? 0,
  // productSnapshot from persistence uses 'productName'; from product object uses 'name'
  productName: productSnapshot?.name ?? productSnapshot?.productName ?? apiItem.productName ?? '',
  imageUrl:    productSnapshot?.imageUrl   ?? apiItem.imageUrl    ?? '',
  brand:       productSnapshot?.brand      ?? apiItem.brand       ?? '',
  category:    productSnapshot?.category   ?? apiItem.category    ?? '',
});

// Merge raw API items with any previously enriched data already in the store
const mergeItems = (apiItems = [], existingItems = []) =>
  apiItems.map((apiItem) => {
    const existing = existingItems.find((e) => e.productId === apiItem.productId);
    return enrichItem(apiItem, existing);
  });

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

        // Guard: skip fetch if already loaded for this user
        const { userId: currentUserId, items, loading } = get();
        if (currentUserId === userId && items.length > 0) return;
        if (loading) return;

        set({ userId, loading: true, error: null });
        try {
          const data = await getCart(userId);
          const existing = get().items;
          set({
            items: mergeItems(data.items || [], existing),
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
      // Accepts full product object so we can snapshot display data.
      // product: { id, name, imageUrl, brand, category, price, ... }
      addToCart: async (product, quantity = 1) => {
        const { userId } = get();
        if (!userId) return;

        const productId = typeof product === 'string' ? product : product.id;
        const snapshot  = typeof product === 'string' ? null : product;

        set({ loading: true, error: null });
        try {
          const data = await addItemToCart(userId, productId, quantity);
          const existing = get().items;
          const merged = mergeItems(data.items || [], [
            ...existing,
            // inject snapshot for the newly added item
            { productId, ...snapshot },
          ]);
          set({
            items: merged,
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
          const existing = get().items;
          set({
            items: mergeItems(data.items || [], existing),
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
          const existing = get().items;
          set({
            items: mergeItems(data.items || [], existing),
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
          set({ items: [], cartTotal: 0, loading: false });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to clear cart',
            loading: false,
          });
        }
      },

      // ── Force refresh ─────────────────────────────────────────────────
      refreshCart: async () => {
        const { userId } = get();
        if (!userId) return;
        set({ loading: true, error: null });
        try {
          const data = await getCart(userId);
          const existing = get().items;
          set({
            items: mergeItems(data.items || [], existing),
            cartTotal: data.cartTotal || 0,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to refresh cart',
            loading: false,
          });
        }
      },

      // ── Reset error ───────────────────────────────────────────────────
      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({
        items: state.items,       // enriched items persisted
        cartTotal: state.cartTotal,
        userId: state.userId,
      }),
    }
  )
);
