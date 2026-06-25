/**
 * useFeaturedProducts.js — Phase 2A
 *
 * What changed:
 *   The useState + useEffect + cancelled-flag pattern has been replaced
 *   with a TanStack Query hook (useFeaturedProductsQuery).
 *
 * What stayed the same (public API contract):
 *   Still returns { products, loading, error }.
 *   All callers (Home.jsx, FeaturedProducts components, etc.) work without
 *   any changes.
 *
 * Cache benefit:
 *   If the user navigates Home → Products → Home, the featured products
 *   are served from cache on the second Home visit. No extra network request.
 */
import { useFeaturedProductsQuery } from '@/hooks/useQueryProducts';

export const useFeaturedProducts = () => {
  const { data, isLoading, isError, error } = useFeaturedProductsQuery();
  return {
    products: Array.isArray(data) ? data : [],
    loading:  isLoading,
    error:    isError ? (error?.message ?? 'Failed to load featured products') : null,
  };
};
