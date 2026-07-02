/**
 * useQueryProducts.js
 *
 * All product-related TanStack Query hooks.
 */
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  getProductsBySubcategory,
  getProductSuggestions,
  searchProducts,
} from '@/services/productService';

const STALE_PRODUCTS = 5 * 60 * 1000;
const STALE_SEARCH = 30 * 1000;

export function useAllProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.allProducts(),
    queryFn: getAllProducts,
    staleTime: STALE_PRODUCTS,
  });
}

export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: getFeaturedProducts,
    staleTime: STALE_PRODUCTS,
  });
}

export function useProductDetailQuery(id) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
    staleTime: STALE_PRODUCTS,
    refetchOnMount: 'always',
  });
}

export function useProductsByCategoryQuery(category) {
  const enabled = Boolean(category) && category !== 'All';
  return useQuery({
    queryKey: queryKeys.products.byCategory(category),
    queryFn: () => getProductsByCategory(category),
    enabled,
    staleTime: STALE_PRODUCTS,
  });
}

export function useProductsByCategory(category) {
  return useProductsByCategoryQuery(category);
}

export function useProductsByCatAndSubQuery(category, subcategory) {
  const enabled = Boolean(category) && Boolean(subcategory);
  return useQuery({
    queryKey: queryKeys.products.byCatAndSub(category, subcategory),
    queryFn: () => getProductsByCategoryAndSubcategory(category, subcategory),
    enabled,
    staleTime: STALE_PRODUCTS,
  });
}

export function useProductsBySubcategoryQuery(subcategory) {
  const enabled = Boolean(subcategory);
  return useQuery({
    queryKey: ['products', 'list', 'subcategory', subcategory],
    queryFn: () => getProductsBySubcategory(subcategory),
    enabled,
    staleTime: STALE_PRODUCTS,
  });
}

export function useProductsBySubcategory(subcategory) {
  return useProductsBySubcategoryQuery(subcategory);
}

export function useProductSearchQuery(keyword, page, size = 20) {
  const normalised = keyword?.trim();
  return useQuery({
    queryKey: ['products', 'search', normalised, page, size],
    queryFn: () => searchProducts(normalised, page, size),
    enabled: Boolean(normalised) && normalised.length >= 2,
    staleTime: STALE_SEARCH,
    placeholderData: keepPreviousData,
  });
}

export function useProductSuggestionsQuery(query) {
  const normalised = query?.trim();
  return useQuery({
    queryKey: ['products', 'suggestions', normalised],
    queryFn: () => getProductSuggestions(normalised),
    enabled: Boolean(normalised) && normalised.length >= 2,
    staleTime: 60 * 1000,
  });
}

export function usePrefetchProductDetail() {
  const qc = useQueryClient();
  return function prefetch(id) {
    if (!id) return;
    qc.prefetchQuery({
      queryKey: queryKeys.products.detail(id),
      queryFn: () => getProductById(id),
      staleTime: STALE_PRODUCTS,
    });
  };
}
