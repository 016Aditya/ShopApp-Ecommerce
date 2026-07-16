/**
 * useCartSync.js — Commit 3
 *
 * Called after a 409 INVENTORY_CONFLICT response to bring the UI back
 * in sync with the database: refetch cart, refetch affected product(s),
 * and invalidate product list caches so StockBadge re-renders correctly.
 */
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys }      from '@/lib/queryKeys';
import { cartKeys }       from '@/features/cart/hooks/useCart';

export const useCartSync = () => {
  const queryClient = useQueryClient();

  /**
   * @param {Object} params
   * @param {string} params.userId
   * @param {string[]} [params.productIds] — specific products to refresh;
   *        if omitted, all product queries are invalidated.
   */
  const syncAfterConflict = async ({ userId, productIds = [] }) => {
    // Refresh the user's cart
    await queryClient.invalidateQueries({ queryKey: cartKeys.all(userId) });

    // Refresh specific product detail queries
    productIds.forEach((id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
    });

    // Refresh product lists so ProductCard StockBadges update everywhere
    queryClient.invalidateQueries({ queryKey: queryKeys.products.list() });
  };

  return { syncAfterConflict };
};