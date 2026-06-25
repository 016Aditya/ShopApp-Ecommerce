/**
 * useQueryProducts.js — Phase 2A
 *
 * All product-related TanStack Query hooks.
 *
 * Rules:
 *  - Never import Axios directly. Always go through productService.
 *  - Each hook exposes only what callers need.
 *  - staleTime overrides match the Phase 2A spec:
 *      All / Featured / Detail / Category → 5 min
 *      Search                             → 30 sec
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  searchProducts,
} from '@/services/productService';

const STALE_PRODUCTS = 5 * 60 * 1000;  // 5 min
const STALE_SEARCH   = 30 * 1000;       // 30 sec

// ── All Products ─────────────────────────────────────────────────────────────────────────────
export function useAllProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.allProducts(),
    queryFn:  getAllProducts,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Featured Products ───────────────────────────────────────────────────────────────────────────
export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn:  getFeaturedProducts,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Product Detail ───────────────────────────────────────────────────────────────────────────
export function useProductDetailQuery(id) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn:  () => getProductById(id),
    enabled:  Boolean(id),
    staleTime: STALE_PRODUCTS,
    // When the product was prefetched (e.g. on hover), show the cached data
    // instantly while a background revalidation runs.
    // When the product is NOT in cache, placeholderData is undefined so the
    // component sees isLoading=true and shows the skeleton correctly.
    placeholderData: (previousData) => previousData ?? undefined,
  });
}

// ── Products by Category ─────────────────────────────────────────────────────────────────────────
export function useProductsByCategoryQuery(category) {
  const enabled = Boolean(category) && category !== 'All';
  return useQuery({
    queryKey: queryKeys.products.byCategory(category),
    queryFn:  () => getProductsByCategory(category),
    enabled,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Products by Category + Subcategory ────────────────────────────────────────────────────────────
export function useProductsByCatAndSubQuery(category, subcategory) {
  const enabled = Boolean(category) && Boolean(subcategory);
  return useQuery({
    queryKey: queryKeys.products.byCatAndSub(category, subcategory),
    queryFn:  () => getProductsByCategoryAndSubcategory(category, subcategory),
    enabled,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Search ──────────────────────────────────────────────────────────────────────────────────
export function useProductSearchQuery(keyword) {
  const normalised = keyword?.trim();
  const enabled    = Boolean(normalised);
  return useQuery({
    queryKey: queryKeys.products.search(normalised),
    queryFn:  () => searchProducts(normalised),
    enabled,
    staleTime: STALE_SEARCH,
    placeholderData: (prev) => prev,
  });
}

// ── Prefetch helper ───────────────────────────────────────────────────────────────────────────
/**
 * usePrefetchProductDetail
 *
 * Returns a stable callback for imperative callers (onMouseEnter,
 * IntersectionObserver) to prefetch a product detail page.
 *
 * Respects staleTime — if data is already fresh in cache, no network
 * request is made.
 */
export function usePrefetchProductDetail() {
  const qc = useQueryClient();
  return function prefetch(id) {
    if (!id) return;
    qc.prefetchQuery({
      queryKey: queryKeys.products.detail(id),
      queryFn:  () => getProductById(id),
      staleTime: STALE_PRODUCTS,
    });
  };
}
