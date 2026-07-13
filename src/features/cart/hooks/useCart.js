import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
} from '@/services/cartService';
import { getProductById } from '@/services/productService';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useToastStore } from '@/store/toastStore';

/**
 * normalizeItem
 *
 * The backend CartItemResponse only returns { productId, quantity, unitPrice }.
 * It does NOT embed a nested product object — productName, imageUrl, brand,
 * and category must be fetched separately via the products API.
 */
const normalizeItem = (item) => ({
  productId:        item.productId        ?? '',
  productName:      item.productName      ?? '',
  imageUrl:         item.imageUrl         ?? '',
  brand:            item.brand            ?? '',
  category:         item.category         ?? '',
  unitPrice:        item.unitPrice        ?? 0,
  quantity:         item.quantity         ?? 1,
  stock:            item.stock            ?? 0,
  maxOrderQuantity: item.maxOrderQuantity ?? 10,
});

// ── Query key factory ─────────────────────────────────────────────────
export const cartKeys = {
  all: (userId) => ['cart', userId],
};

// ── Fetch cart (with product detail enrichment) ──────────────────────────
export const useCartQuery = () => {
  const user   = useAuthStore((s) => s.user);
  const userId = user?.id;

  return useQuery({
    queryKey: cartKeys.all(userId),
    queryFn:  async () => {
      const data = await getCart(userId);
      const rawItems = data?.items ?? [];

      const enriched = await Promise.all(
        rawItems.map(async (item) => {
          if (item.productName) return normalizeItem(item);
          try {
            const product = await getProductById(item.productId);
            return {
              productId:        item.productId,
              productName:      product?.name      ?? product?.title ?? '',
              imageUrl:         product?.imageUrl  ?? product?.image ?? '',
              brand:            product?.brand     ?? '',
              category:         product?.category  ?? '',
              unitPrice:        item.unitPrice     ?? product?.price ?? 0,
              quantity:         item.quantity      ?? 1,
              stock:            product?.stock            ?? 0,
              maxOrderQuantity: product?.maxOrderQuantity ?? 10,
            };
          } catch {
            return normalizeItem(item);
          }
        })
      );

      return { ...data, items: enriched };
    },
    enabled:  !!userId,
    staleTime: 1000 * 30,
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

// ── Add item ───────────────────────────────────────────────────────────────
export const useAddToCart = () => {
  const queryClient     = useQueryClient();
  const user            = useAuthStore((s) => s.user);
  const logout          = useAuthStore((s) => s.logout);
  const addOptimistic   = useCartStore((s) => s.addOptimistic);
  const clearOptimistic = useCartStore((s) => s.clearOptimistic);
  // ⭐ Single global toast trigger — fires from here so EVERY add-to-cart
  //    location gets the toast without any per-component wiring.
  const showCartToast   = useToastStore((s) => s.showCartToast);
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
      // Show global portal toast — works from any component, any page
      showCartToast();
    },
    onError: (error) => {
      if (error?.response?.status === 401) logout();
    },
    onSettled: () => {
      clearOptimistic();
    },
  });
};

// ── Update item quantity ──────────────────────────────────────────────
export const useUpdateCartItem = () => {
  const queryClient    = useQueryClient();
  const user           = useAuthStore((s) => s.user);
  const logout         = useAuthStore((s) => s.logout);
  const showErrorToast = useToastStore((s) => s.showErrorToast);
  const userId = user?.id;

  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      updateCartItem(userId, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all(userId) });
    },
    onError: (error) => {
      if (error?.response?.status === 401) { 
        logout(); 
        return; 
      }
      
      const data = error?.response?.data;
      if (data?.code === 'INSUFFICIENT_STOCK' || data?.code === 'MAX_QUANTITY_EXCEEDED') {
        if (showErrorToast) {
          showErrorToast(data.message); 
        }
      }
    },
  });
};

// ── Remove item ──────────────────────────────────────────────────────────────
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

// ── Clear cart ──────────────────────────────────────────────────────────────
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

  return { items, cartTotal, loading, error: errorMsg, updateItem, removeItem, emptyCart };
};

export default useCart;