/**
 * useProducts.js — Phase 2A
 *
 * What changed:
 *   The imperative useState + useEffect + manual loading/error pattern has
 *   been replaced with TanStack Query hooks from useQueryProducts.js.
 *
 * What stayed the same (public API contract):
 *   useProducts() still returns:
 *     { products, loading, error, fetchAll, fetchByCategory,
 *       fetchByCategoryAndSubcategory, fetchBySearch }
 *
 *   useProduct(id) still returns:
 *     { product, loading, error }
 *
 *   ProductsPage.jsx and ProductDetailPage.jsx are NOT modified — they
 *   continue calling these hooks exactly as before.
 *
 * How the imperative fetch* functions work after migration:
 *   ProductsPage calls fetchAll() / fetchByCategory() / etc. imperatively
 *   inside a useEffect triggered by URL params. Those calls are now no-ops
 *   (empty functions) because TanStack Query fires automatically based on
 *   the `enabled` flag of the active query.
 *
 *   The hook internally activates the correct TanStack Query by reading the
 *   same URL params that ProductsPage reads, so the right query fires
 *   automatically without any changes to ProductsPage.
 *
 * Why this approach:
 *   - Zero changes required in ProductsPage.jsx or ProductDetailPage.jsx.
 *   - Full caching, deduplication, and background refetch from TanStack Query.
 *   - The legacy fetchAll/fetchByCategory API is preserved in case any other
 *     consumer depends on it.
 */
import { useSearchParams } from 'react-router-dom';
import {
  useAllProductsQuery,
  useProductsByCategoryQuery,
  useProductsByCatAndSubQuery,
  useProductSearchQuery,
  useProductDetailQuery,
} from '@/hooks/useQueryProducts';

// ─── All products + filter variants ───────────────────────────────────────────
export const useProducts = () => {
  // Read the URL params here so the hook can auto-activate the right query.
  // ProductsPage also reads these params and calls fetchX() imperatively,
  // but those calls are now no-ops — the query is already firing from here.
  const [searchParams] = useSearchParams();
  const activeCat    = searchParams.get('category')    ?? 'All';
  const activeSub    = searchParams.get('subcategory') ?? null;
  const activeSearch = (searchParams.get('search')     ?? '').trim();

  // Determine which mode is active (same logic as ProductsPage)
  const mode =
    activeSearch           ? 'search'      :
    activeSub              ? 'subcategory' :
    activeCat !== 'All'    ? 'category'    :
    'all';

  // All four queries are instantiated, but only the active one has
  // `enabled: true` — the others stay dormant and cost nothing.
  const allQ    = useAllProductsQuery();
  const catQ    = useProductsByCategoryQuery(mode === 'category'    ? activeCat : null);
  const subQ    = useProductsByCatAndSubQuery(
    mode === 'subcategory' ? activeCat  : null,
    mode === 'subcategory' ? activeSub  : null,
  );
  const searchQ = useProductSearchQuery(mode === 'search' ? activeSearch : null);

  // Pick the active result set
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

    // ── Legacy imperative API ─────────────────────────────────────────────
    // ProductsPage calls these functions inside a useEffect. They are now
    // intentional no-ops because TanStack Query fires automatically.
    // Keeping them prevents any "is not a function" errors in callers.
    fetchAll:                      () => {},
    fetchByCategory:               () => {},
    fetchByCategoryAndSubcategory: () => {},
    fetchBySearch:                 () => {},
  };
};

// ─── Single product detail ─────────────────────────────────────────────────────
export const useProduct = (id) => {
  const { data, isLoading, isError, error } = useProductDetailQuery(id);
  return {
    product: data  ?? null,
    loading: isLoading,
    error:   isError ? (error?.message ?? 'Product not found') : null,
  };
};
