import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore }  from '@/store/authStore';
import { queryKeys }     from '@/lib/queryKeys';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '@/services/wishlistService';

/**
 * useWishlistQuery
 *
 * Fetches the authenticated user's wishlist from the backend.
 * Only runs when a user is logged in (enabled: !!userId).
 *
 * Returns items in the normalized flat shape:
 *   { productId, productName, imageUrl, brand, category, unitPrice }
 *
 * The backend may return a nested { product: {...}, quantity } shape — the
 * normalizeWishlistItem helper coerces it to the flat shape consumed by
 * WishlistPage and WishlistItem components.
 */
const normalizeWishlistItem = (item) => {
  // Already normalized
  if (item.productId) return item;

  const p = item.product ?? {};
  return {
    productId:   item.productId   ?? p.id       ?? '',
    productName: item.productName ?? p.name     ?? p.title ?? '',
    imageUrl:    item.imageUrl    ?? p.imageUrl ?? p.image ?? '',
    brand:       item.brand       ?? p.brand    ?? '',
    category:    item.category    ?? p.category ?? '',
    unitPrice:   item.unitPrice   ?? p.price    ?? 0,
  };
};

// ── Fetch wishlist ──────────────────────────────────────────────────────────
export const useWishlistQuery = () => {
  const user   = useAuthStore((s) => s.user);
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.wishlist.byUser(userId),
    queryFn:  async () => {
      const data = await getWishlist(userId);
      // Backend may return an array directly, or { items: [...] }
      const raw = Array.isArray(data) ? data : (data?.items ?? data?.products ?? []);
      return raw.map(normalizeWishlistItem);
    },
    enabled:   !!userId,
    staleTime: 1000 * 60 * 2, // 2 min — wishlist changes infrequently
    retry: (failureCount, error) => {
      // Never retry on auth errors
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

// ── Add to wishlist ─────────────────────────────────────────────────────────
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  const logout      = useAuthStore((s) => s.logout);
  const userId      = user?.id;

  return useMutation({
    /**
     * productId — string ID of the product to wishlist.
     * Pass either the raw ID string or a full product object;
     * this hook always extracts the ID before calling the service.
     */
    mutationFn: ({ productId }) => addToWishlist(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.byUser(userId) });
    },
    onError: (error) => {
      if (error?.response?.status === 401) logout();
    },
  });
};

// ── Remove from wishlist ────────────────────────────────────────────────────
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  const logout      = useAuthStore((s) => s.logout);
  const userId      = user?.id;

  return useMutation({
    mutationFn: ({ productId }) => removeFromWishlist(userId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.byUser(userId) });
    },
    onError: (error) => {
      if (error?.response?.status === 401) logout();
    },
  });
};

/**
 * useIsInWishlist
 *
 * Convenience hook — returns true/false for a single productId.
 * Reads from the already-cached wishlist query so no extra network call.
 *
 * Usage:
 *   const inWishlist = useIsInWishlist(product.id);
 */
export const useIsInWishlist = (productId) => {
  const user   = useAuthStore((s) => s.user);
  const userId = user?.id;

  const { data: items = [] } = useQuery({
    queryKey: queryKeys.wishlist.byUser(userId),
    enabled:  false, // never fetch — only read from cache
  });

  return items.some((item) => item.productId === String(productId));
};

/**
 * useWishlist — default export facade
 *
 * Single hook surface for WishlistPage and WishlistItem components.
 * Mirrors the useCart() facade pattern.
 */
const useWishlist = () => {
  const { data: items = [], isLoading, isError, error } = useWishlistQuery();
  const addMutation    = useAddToWishlist();
  const removeMutation = useRemoveFromWishlist();

  const loading = isLoading || addMutation.isPending || removeMutation.isPending;
  const errorMsg = isError
    ? (error?.response?.data?.message ?? 'Failed to load wishlist')
    : null;

  const addItem    = (productId) => addMutation.mutate({ productId });
  const removeItem = (productId) => removeMutation.mutate({ productId });
  const isInWishlist = (productId) =>
    items.some((i) => i.productId === String(productId));

  return {
    items,
    loading,
    error: errorMsg,
    addItem,
    removeItem,
    isInWishlist,
  };
};

export default useWishlist;
