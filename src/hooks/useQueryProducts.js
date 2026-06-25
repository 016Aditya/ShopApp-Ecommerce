/**
 * useQueryProducts.js — Phase 2A
 *
 * All product-related TanStack Query hooks.
 *
 * Rules:
 *  - Never import Axios directly. Always go through productService.
 *  - Each hook exposes only what callers need.
 *  - staleTime overrides:
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
    // NO placeholderData here.
    //
    // With placeholderData present, TanStack Query v5 sets status='success'
    // and isLoading=false immediately on mount — even for a brand-new ID
    // that has never been fetched. This means the component skips the
    // skeleton and renders whatever stale data the callback returns.
    //
    // Without placeholderData:
    //   - Cold product (not in cache) → isLoading=true → skeleton shown
    //   - Prefetched product (already in cache as real data) → isLoading=false
    //     → renders immediately with correct data — no skeleton needed
    //
    // Prefetching via usePrefetchProductDetail populates the cache as a
    // real cache entry, so those products still show instantly with no
    // loading state. placeholderData is not needed for that use case.
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
    // Search keeps placeholderData so the grid doesn't flash empty
    // between keystrokes — this is intentional and safe because search
    // results never leak into a different product's detail page.
    placeholderData: (prev) => prev,
  });
}

// ── Prefetch helper ───────────────────────────────────────────────────────────────────────────
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
