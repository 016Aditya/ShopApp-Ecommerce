import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Wishlist item shape mirrors enriched cart item:
// { productId, productName, imageUrl, brand, category, unitPrice }

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item — no duplicates
      addToWishlist: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) return;
        set((state) => ({ items: [...state.items, item] }));
      },

      // Remove item
      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      // Check if item is in wishlist
      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      // Clear all
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-store',
    }
  )
);
