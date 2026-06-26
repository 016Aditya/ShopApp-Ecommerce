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
 * Exports:
 *   Named hooks (granular, one operation each):
 *     useCartQuery, useAddToCart, useUpdateCartItem,
 *     useRemoveFromCart, useClearCart
 *
 *   Default export — useCart() facade:
 *     Returns the flat { items, cartTotal, loading, error,
 *                        updateItem, removeItem, emptyCart }
 *     shape that CartPage and CartItem already consume.
 *     This lets existing components work without any changes.
 */

// ── Query key factory ───────────────────────────────────────────────────────
export const cartKeys = {
  all: (userId) => ['cart', userId],
};

// ── Fetch cart ─────────────────────────────────────────────────────────────
export const useCartQuery = () => {
  const user   = useAuthStore((s) => s.user);
  const userId = user?.id;

  return useQuery({
    queryKey: cartKeys.all(userId),
    queryFn:  () => getCart(userId),
    enabled:  !!userId,
    staleTime: 1000 * 30,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

// ── Add item ─────────────────────────────────────────────────────────────
export const useAddToCart = () => {
  const queryClient     = useQueryClient();
  const user            = useAuthStore((s) => s.user);
  const logout          = useAuthStore((s) => s.logout);
  const addOptimistic   = useCartStore((s) => s.addOptimistic);
  const clearOptimistic = useCartStore((s) => s.clearOptimistic);
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ product, quantity = 1 }) => {
      const productId = typeof product === 'string' ? product : product.id;
      return addItemToCart(userId, productId, quantity);
    },
    onMutate: ({ product, quantity = 1 }) => {
      if (typeof product !== 'string') addOptimistic(product, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all(userId) });
    },
    onError: (error) => {
      if (error?.response?.status === 401) logout();
    },
    onSettled: () => {
      clearOptimistic();
    },
  });
};

// ── Update item quantity ──────────────────────────────────────────────────
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

// ── Remove item ────────────────────────────────────────────────────────────
export const useRemoveFromCart = () => {
  const queryClient      = useQueryClient();
  const user             = useAuthStore((s) => s.user);
  const logout           = useAuthStore((s) => s.logout);
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

// ── Clear cart ────────────────────────────────────────────────────────────
export const useClearCart = () => {
  const queryClient     = useQueryClient();
  const user            = useAuthStore((s) => s.user);
  const logout          = useAuthStore((s) => s.logout);
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

// ── DEFAULT EXPORT — useCart() facade ─────────────────────────────────────────
//
// Provides the flat { items, cartTotal, loading, error,
//                     updateItem, removeItem, emptyCart } shape
// that CartPage and CartItem consume.
//
// updateItem(productId, quantity)  → useUpdateCartItem mutation
// removeItem(productId)            → useRemoveFromCart mutation
// emptyCart()                      → useClearCart mutation
//
const useCart = () => {
  const { data, isLoading, isError, error } = useCartQuery();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveFromCart();
  const clearMutation  = useClearCart();

  const items     = data?.items     ?? [];
  const cartTotal = data?.cartTotal ?? 0;

  // Combine loading states: true if the query is loading OR any mutation
  // is currently in-flight (so CartPage spinner covers the whole operation)
  const loading =
    isLoading ||
    updateMutation.isPending ||
    removeMutation.isPending ||
    clearMutation.isPending;

  const errorMsg = isError
    ? (error?.response?.data?.message ?? 'Failed to load cart')
    : null;

  /**
   * updateItem(productId, quantity)
   * Wraps useUpdateCartItem.mutate so callers don't need to pass { productId, quantity } object.
   */
  const updateItem = (productId, quantity) =>
    updateMutation.mutate({ productId, quantity });

  /**
   * removeItem(productId)
   * Wraps useRemoveFromCart.mutate so callers don't need to pass { productId } object.
   */
  const removeItem = (productId) =>
    removeMutation.mutate({ productId });

  /**
   * emptyCart()
   * Clears the entire cart on the server and invalidates the TQ cache.
   */
  const emptyCart = () => clearMutation.mutate();

  return {
    items,
    cartTotal,
    loading,
    error: errorMsg,
    updateItem,
    removeItem,
    emptyCart,
  };
};

export default useCart;
