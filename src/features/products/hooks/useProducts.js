/**
 * useProducts.js — Phase 2A
 *
 * Wraps TanStack Query hooks and exposes the same public API that
 * ProductsPage.jsx and ProductDetailPage.jsx have always consumed.
 *
 * Key invariant for useProduct(id):
 *   We must NEVER render product data from a previous route param.
 *   TanStack Query can return cached data for a different product ID
 *   on the very first render after a key= remount (cache hit for a
 *   previously visited / prefetched product). The explicit id-match
 *   guard below is the only airtight way to prevent that.
 */
import { useSearchParams } from 'react-router-dom';
import {
  useAllProductsQuery,
  useProductsByCategoryQuery,
  useProductsByCatAndSubQuery,
  useProductSearchQuery,
  useProductDetailQuery,
} from '@/hooks/useQueryProducts';

// ── All products + filter variants ──────────────────────────────────────────────────
export const useProducts = () => {
  const [searchParams] = useSearchParams();
  const activeCat    = searchParams.get('category')    ?? 'All';
  const activeSub    = searchParams.get('subcategory') ?? null;
  const activeSearch = (searchParams.get('search')     ?? '').trim();

  const mode =
    activeSearch           ? 'search'      :
    activeSub              ? 'subcategory' :
    activeCat !== 'All'    ? 'category'    :
    'all';

  const allQ    = useAllProductsQuery();
  const catQ    = useProductsByCategoryQuery(mode === 'category'    ? activeCat : null);
  const subQ    = useProductsByCatAndSubQuery(
    mode === 'subcategory' ? activeCat  : null,
    mode === 'subcategory' ? activeSub  : null,
  );
  const searchQ = useProductSearchQuery(mode === 'search' ? activeSearch : null);

  const active =
    mode === 'search'      ? searchQ :
    mode === 'subcategory' ? subQ    :
    mode === 'category'    ? catQ    :
    allQ;

  return {
    products: Array.isArray(active.data) ? active.data : [],
    loading:  active.isLoading,
    error:    active.isError
      ? (active.error?.message ?? 'Failed to load products')
      : null,
    fetchAll:                      () => {},
    fetchByCategory:               () => {},
    fetchByCategoryAndSubcategory: () => {},
    fetchBySearch:                 () => {},
  };
};

// ── Single product detail ────────────────────────────────────────────────────────────────────
export const useProduct = (id) => {
  const numericId = Number(id);
  const { data, isLoading, isPending, isError, error } = useProductDetailQuery(id);

  // • TQ may return cached data from a *different* product on the first
  //   render after a route change (e.g. a previously visited / prefetched
  //   product that shares nothing with the current id).
  // • We only expose data to the component once it is confirmed to belong
  //   to the current route id.
  // • This guard fires only in the brief window between mount and the
  //   cache lookup settling. Once data.id === numericId, it stays that way.
  const isCorrectData = data != null && data.id === numericId;

  return {
    product: isCorrectData ? data : null,
    // Show skeleton when:
    //   1. TQ itself is loading (no cache entry for this id), OR
    //   2. Cache returned data but it belongs to a different product.
    loading: isLoading || !isCorrectData,
    error:   isCorrectData && isError
      ? (error?.message ?? 'Product not found')
      : null,
  };
};
