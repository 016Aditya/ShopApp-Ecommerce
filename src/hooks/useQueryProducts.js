/**
 * useQueryProducts.js
 *
 * All product-related TanStack Query hooks.
 *
 * Rules:
 *  - Never import Axios directly. Always go through productService.
 *  - Each hook exposes only what callers need.
 *  - staleTime overrides:
 *      All / Featured / Category → 5 min
 *      Detail                    → 5 min, but refetchOnMount: 'always'
 *      Search                    → 30 sec
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

// ── All Products ────────────────────────────────────────────────────────────────────────────────────────
export function useAllProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.allProducts(),
    queryFn:  getAllProducts,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Featured Products ────────────────────────────────────────────────────────────────────────────────────
export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn:  getFeaturedProducts,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Product Detail ───────────────────────────────────────────────────────────────────────────────────
/**
 * useProductDetailQuery
 *
 * refetchOnMount: 'always'
 *
 * WHY THIS IS NECESSARY:
 *
 * ProductCard uses IntersectionObserver (mobile) and onMouseEnter (desktop)
 * to prefetch every visible product into the TQ cache. With staleTime=5min,
 * every product in the grid is cached and "fresh" for the entire browsing
 * session. When ProductDetailPage mounts for a new product id, TQ finds
 * fresh cached data and returns it immediately with isPending=false.
 *
 * This is correct behaviour when the cached data matches the current id.
 * But if there is any React render timing issue (StrictMode double-invoke,
 * Suspense boundary mid-transition, concurrent mode interruption) where
 * the component briefly subscribes to the wrong query key, the wrong
 * cached product is returned instantly with no loading state to mask it.
 *
 * refetchOnMount: 'always' ensures that on every mount, regardless of
 * staleTime, TQ dispatches a fresh network request for the current id.
 * The cached data is STILL returned immediately (zero latency to first
 * render), but a background re-fetch is always in flight. If the initial
 * render showed the wrong product due to a key race, the fresh response
 * arrives and corrects it within one network round-trip — typically
 * 50–300ms, imperceptible to the user.
 *
 * This does NOT cause a loading flash or skeleton regression. The
 * background fetch updates the data in-place once it resolves.
 */
export function useProductDetailQuery(id) {
  return useQuery({
    queryKey:       queryKeys.products.detail(id),
    queryFn:        () => getProductById(id),
    enabled:        Boolean(id),
    staleTime:      STALE_PRODUCTS,
    refetchOnMount: 'always',
  });
}

// ── Products by Category ──────────────────────────────────────────────────────────────────────────────────
export function useProductsByCategoryQuery(category) {
  const enabled = Boolean(category) && category !== 'All';
  return useQuery({
    queryKey: queryKeys.products.byCategory(category),
    queryFn:  () => getProductsByCategory(category),
    enabled,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Products by Category + Subcategory ───────────────────────────────────────────────────────────────────────
export function useProductsByCatAndSubQuery(category, subcategory) {
  const enabled = Boolean(category) && Boolean(subcategory);
  return useQuery({
    queryKey: queryKeys.products.byCatAndSub(category, subcategory),
    queryFn:  () => getProductsByCategoryAndSubcategory(category, subcategory),
    enabled,
    staleTime: STALE_PRODUCTS,
  });
}

// ── Search ──────────────────────────────────────────────────────────────────────────────────────────
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

// ── Prefetch helper ───────────────────────────────────────────────────────────────────────────────────────
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
