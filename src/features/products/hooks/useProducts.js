/**
 * useProducts.js — Phase 2A
 *
 * Wraps TanStack Query hooks and exposes the same public API that
 * ProductsPage.jsx and ProductDetailPage.jsx have always consumed.
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
  const { data, isLoading, isError, error } = useProductDetailQuery(id);
  return {
    product: data ?? null,
    loading: isLoading,
    error:   isError ? (error?.message ?? 'Product not found') : null,
  };
};
