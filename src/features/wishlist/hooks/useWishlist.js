import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore }  from '@/store/authStore';
import { queryKeys }     from '@/lib/queryKeys';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '@/services/wishlistService';

// Backend WishlistItem: { productId, name, price, imageUrl, brand, category }
const normalizeWishlistItem = (item) => ({
  productId:   item.productId                    ?? '',
  productName: item.productName ?? item.name     ?? '',  // backend → .name
  imageUrl:    item.imageUrl                     ?? '',
  brand:       item.brand                        ?? '',
  category:    item.category                     ?? '',
  unitPrice:   item.unitPrice   ?? item.price    ?? 0,   // backend → .price
});

export const useWishlistQuery = () => {
  const user   = useAuthStore((s) => s.user);
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.wishlist.byUser(userId),
    queryFn:  async () => {
      const data = await getWishlist(userId);
      // Backend returns { id, userId, items: [...] }
      const raw = data?.items ?? (Array.isArray(data) ? data : []);
      return raw.map(normalizeWishlistItem);
    },
    enabled:   !!userId,
    staleTime: 1000 * 60 * 2,
    retry: (count, err) => err?.response?.status === 401 ? false : count < 2,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  const userId      = user?.id;

  return useMutation({
    mutationFn: ({ productId }) => addToWishlist(userId, productId),
    onSuccess:  () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.byUser(userId) }),
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  const userId      = user?.id;

  return useMutation({
    mutationFn: ({ productId }) => removeFromWishlist(userId, productId),
    onSuccess:  () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.byUser(userId) }),
  });
};
