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
 * normalizeItem
 *
 * The backend returns cart items in two possible shapes:
 *
 *   Shape A (server response) — nested product object:
 *     { product: { id, name, imageUrl, brand, category, price }, quantity, unitPrice }
 *
 *   Shape B (optimistic / already-normalized):
 *     { productId, productName, imageUrl, brand, category, unitPrice, quantity }
 *
 * CartItem, CheckoutItems, and WishlistPage all consume Shape B.
 * This normalizer coerces Shape A → Shape B, and passes Shape B through unchanged.
 */
const normalizeItem = (item) => {
  // Already normalized (optimistic or previously transformed)
  if (item.productId) return item;

  const p = item.product ?? {};
  return {
    productId:   item.productId   ?? p.id          ?? '',
    productName: item.productName ?? p.name        ?? p.title ?? '',
    imageUrl:    item.imageUrl    ?? p.imageUrl    ?? p.image ?? '',
    brand:       item.brand       ?? p.brand       ?? '',
    category:    item.category    ?? p.category    ?? '',
    unitPrice:   item.unitPrice   ?? p.price       ?? 0,
    quantity:    item.quantity    ?? 1,
  };
};

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
    queryFn:  async () => {
      const data = await getCart(userId);
      // Normalize all items to flat shape on the way in
      return {
        ...data,
        items: (data?.items ?? []).map(normalizeItem),
      };
    },
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

// ── DEFAULT EXPORT — useCart() facade ─────────────────────────────────────────────
const useCart = () => {
  const { data, isLoading, isError, error } = useCartQuery();
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveFromCart();
  const clearMutation  = useClearCart();

  // Items are already normalized by useCartQuery’s queryFn
  const items     = data?.items     ?? [];
  const cartTotal = data?.cartTotal ?? 0;

  const loading =
    isLoading ||
    updateMutation.isPending ||
    removeMutation.isPending ||
    clearMutation.isPending;

  const errorMsg = isError
    ? (error?.response?.data?.message ?? 'Failed to load cart')
    : null;

  const updateItem = (productId, quantity) =>
    updateMutation.mutate({ productId, quantity });

  const removeItem = (productId) =>
    removeMutation.mutate({ productId });

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
