/**
 * useQueryProducts.js — Phase 2A
 *
 * All product-related TanStack Query hooks.
 *
 * Rules:
 *  - Never import Axios directly. Always go through productService.
 *  - Each hook exposes only what callers need — keep the surface minimal.
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

// ── All Products ─────────────────────────────────────────────────────────────
export function useAllProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.allProducts(),
    queryFn:  getAllProducts,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Featured Products ─────────────────────────────────────────────────────────
export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn:  getFeaturedProducts,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Product Detail ────────────────────────────────────────────────────────────
export function useProductDetailQuery(id) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn:  () => getProductById(id),
    enabled:  Boolean(id),
    staleTime: STALE_PRODUCTS,
  });
}

// ── Products by Category ──────────────────────────────────────────────────────
export function useProductsByCategoryQuery(category) {
  // Disable when category is falsy or the sentinel 'All' value
  const enabled = Boolean(category) && category !== 'All';
  return useQuery({
    queryKey: queryKeys.products.byCategory(category),
    queryFn:  () => getProductsByCategory(category),
    enabled,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Products by Category + Subcategory ────────────────────────────────────────
export function useProductsByCatAndSubQuery(category, subcategory) {
  const enabled = Boolean(category) && Boolean(subcategory);
  return useQuery({
    queryKey: queryKeys.products.byCatAndSub(category, subcategory),
    queryFn:  () => getProductsByCategoryAndSubcategory(category, subcategory),
    enabled,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Search ────────────────────────────────────────────────────────────────────
export function useProductSearchQuery(keyword) {
  // Trim + lowercase so 'iPhone' and 'iphone' share the same cache entry
  const normalised = keyword?.trim();
  const enabled    = Boolean(normalised);
  return useQuery({
    queryKey: queryKeys.products.search(normalised),
    queryFn:  () => searchProducts(normalised),
    enabled,
    staleTime: STALE_SEARCH,
    // Keep previous data visible while a new search is in flight so the
    // grid doesn't flash empty between keystrokes.
    placeholderData: (prev) => prev,
  });
}

// ── Prefetch helper ───────────────────────────────────────────────────────────
/**
 * usePrefetchProductDetail
 *
 * Returns a stable callback that imperative callers (onMouseEnter,
 * IntersectionObserver) can invoke to prefetch a product detail page.
 *
 * Respects staleTime — if data is already fresh in the cache, no network
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
