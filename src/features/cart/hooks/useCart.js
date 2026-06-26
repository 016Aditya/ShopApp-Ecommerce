import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} from '@/services/cartService';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

/**
 * useCart — TanStack Query hooks for all cart server-state
 *
 * Ownership contract:
 *   TanStack Query owns: fetching, mutations, caching, background refetch
 *   Zustand (cartStore):  UI flags only (drawer open/close, optimistic items)
 *   Zustand (authStore):  JWT token + user identity
 *
 * 401 handling:
 *   If any mutation receives a 401 error it calls authStore.logout().
 *   The Axios interceptor (api.js) will also clear localStorage and redirect
 *   to /login. Both paths are safe to run concurrently — logout() is idempotent.
 *
 * Query key: ['cart', userId]
 *   Scoped to userId so swapping accounts immediately invalidates the cache.
 */

// ── Query key factory ───────────────────────────────────────────────────────
export const cartKeys = {
  all:  (userId) => ['cart', userId],
};

// ── Fetch cart ──────────────────────────────────────────────────────────────
/**
 * useCartQuery
 * Fetches the current user's cart from the server.
 * Disabled when userId is falsy (guest / logged-out state).
 */
export const useCartQuery = () => {
  const user   = useAuthStore((s) => s.user);
  const userId = user?.id;

  return useQuery({
    queryKey: cartKeys.all(userId),
    queryFn:  () => getCart(userId),
    enabled:  !!userId,
    staleTime: 1000 * 30,         // 30 s — cart is user-action driven, not polling
    retry: (failureCount, error) => {
      // Never retry on 401 — the session is gone; retrying just loops
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

// ── Add item ────────────────────────────────────────────────────────────────
/**
 * useAddToCart
 * Mutation: POST /api/cart/:userId/add  (via cartService.addItemToCart)
 *
 * Optimistic flow:
 *   1. addOptimistic() → Zustand snapshot updated instantly (zero-latency UI)
 *   2. mutation fires   → server processes the add
 *   3. onSuccess        → invalidate ['cart', userId] → TanStack refetches real data
 *   4. onSettled        → clearOptimistic() removes the local snapshot
 */
export const useAddToCart = () => {
  const queryClient  = useQueryClient();
  const user         = useAuthStore((s) => s.user);
  const logout       = useAuthStore((s) => s.logout);
  const addOptimistic    = useCartStore((s) => s.addOptimistic);
  const clearOptimistic  = useCartStore((s) => s.clearOptimistic);
  const userId = user?.id;

  return useMutation({
    /**
     * @param {{ product: object, quantity?: number }} vars
     * product must have at least: { id, name, price, imageUrl }
     */
    mutationFn: ({ product, quantity = 1 }) => {
      const productId = typeof product === 'string' ? product : product.id;
      return addItemToCart(userId, productId, quantity);
    },

    onMutate: ({ product, quantity = 1 }) => {
      // Instant UI feedback before server responds
      if (typeof product !== 'string') {
        addOptimistic(product, quantity);
      }
    },

    onSuccess: () => {
      // Invalidate so TanStack refetches the authoritative server cart
      queryClient.invalidateQueries({ queryKey: cartKeys.all(userId) });
    },

    onError: (error) => {
      if (error?.response?.status === 401) {
        // Token expired mid-session — clean logout; Axios interceptor will redirect
        logout();
      }
    },

    onSettled: () => {
      // Whether success or error, clear the optimistic snapshot
      clearOptimistic();
    },
  });
};

// ── Update item quantity ────────────────────────────────────────────────────
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  const logout      = useAuthStore((s) => s.logout);
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      updateCartItem(userId, productId, quantity),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all(userId) });
    },

    onError: (error) => {
      if (error?.response?.status === 401) logout();
    },
  });
};

// ── Remove item ─────────────────────────────────────────────────────────────
export const useRemoveFromCart = () => {
  const queryClient    = useQueryClient();
  const user           = useAuthStore((s) => s.user);
  const logout         = useAuthStore((s) => s.logout);
  const removeOptimistic = useCartStore((s) => s.removeOptimistic);
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ productId }) => removeItemFromCart(userId, productId),

    onMutate: ({ productId }) => {
      removeOptimistic(productId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all(userId) });
    },

    onError: (error) => {
      if (error?.response?.status === 401) logout();
    },
  });
};

// ── Clear cart ──────────────────────────────────────────────────────────────
export const useClearCart = () => {
  const queryClient   = useQueryClient();
  const user          = useAuthStore((s) => s.user);
  const logout        = useAuthStore((s) => s.logout);
  const clearOptimistic = useCartStore((s) => s.clearOptimistic);
  const userId = user?.id;

  return useMutation({
    mutationFn: () => clearCart(userId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all(userId) });
      clearOptimistic();
    },

    onError: (error) => {
      if (error?.response?.status === 401) logout();
    },
  });
};
