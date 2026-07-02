import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useAllProductsQuery,
  useProductSearchQuery,
  useProductsByCategory,
  useProductsBySubcategory,
} from '@/hooks/useQueryProducts';
import ProductGrid from '../components/ProductGrid';
import ProductSearch from '../components/ProductSearch';
import ProductFilter from '../components/ProductFilter';
import { ProductCardSkeleton } from '@/components/skeleton';
import { prefetchProductDetailPage } from '@/utils/prefetch';
import { useProductSearchParams } from '../hooks/useProductSearchParams';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { search, page, setSearch, setPage } = useProductSearchParams();

  const activeCat    = searchParams.get('category')    ?? 'All';
  const activeSub    = searchParams.get('subcategory') ?? null;
  const activeSearch = search;
  const isSearchMode = activeSearch.trim().length >= 2;

  const searchResult = useProductSearchQuery(activeSearch, page);
  const subcategoryResult = useProductsBySubcategory(activeSub);
  const categoryResult = useProductsByCategory(activeCat);
  const allProductsResult = useAllProductsQuery();

  const activeResult = isSearchMode
    ? searchResult
    : activeSub
      ? subcategoryResult
      : activeCat !== 'All'
        ? categoryResult
        : allProductsResult;

  const { data, isLoading: loading, isError, error: queryError } = activeResult;
  const products = isSearchMode ? (data?.content ?? []) : (data ?? []);
  const error = isError ? (queryError?.message ?? 'Failed to load products') : null;
  const totalPages = isSearchMode ? (data?.totalPages ?? 0) : 0;
  const hasNext = isSearchMode ? Boolean(data?.hasNext) : false;
  const hasPrevious = isSearchMode ? Boolean(data?.hasPrevious) : false;

  // Stage 1: prefetch ProductDetail during idle time once the products list
  // is visible — very likely the user will click a product next.
  useEffect(() => {
    if (!loading && products.length > 0) {
      prefetchProductDetailPage();
    }
  }, [loading, products.length]);

  const handleSearch = useCallback(
    (keyword) => {
      if (activeSearch === keyword) return;
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (keyword) {
          next.set('search', keyword.trim());
          next.set('page', '0');
          next.delete('subcategory');
        } else {
          next.delete('search');
          next.delete('page');
        }
        return next;
      });
    },
    [activeSearch, setSearchParams]
  );

  const handleClearSearch = useCallback(() => {
    if (!activeSearch) return;
    setSearch('');
  }, [activeSearch, setSearch]);

  const handleCategorySelect = useCallback(
    (category) => {
      setSearchParams(category === 'All' ? {} : { category });
    },
    [setSearchParams]
  );

  const handleSubcategorySelect = useCallback(
    (sub) => {
      if (!sub) {
        setSearchParams(activeCat !== 'All' ? { category: activeCat } : {});
        return;
      }
      setSearchParams({ category: activeCat, subcategory: sub });
    },
    [activeCat, setSearchParams]
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="container-app py-6">
        {(activeCat !== 'All' || activeSearch) && (
          <div
            className="mb-3 flex items-center gap-2 rounded-sm px-4 py-2 text-sm shadow-sm"
            style={{
              backgroundColor: 'var(--card-bg-elevated)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            {activeSearch ? (
              <>
                <span className="font-semibold">Search:</span> &ldquo;{activeSearch}&rdquo;
              </>
            ) : (
              <>
                <span className="font-semibold">Category:</span> {activeCat}
                {activeSub ? ` > ${activeSub}` : ''}
              </>
            )}
            <button
              onClick={handleClearSearch}
              className="ml-auto text-xs font-medium hover:underline"
              style={{ color: 'var(--info-text)' }}
            >
              Clear x
            </button>
          </div>
        )}

        <div
          className="mb-4 flex flex-col gap-3 rounded-sm p-4 shadow-sm"
          style={{
            backgroundColor: 'var(--card-bg-elevated)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ProductSearch
              key={activeSearch}
              onSearch={handleSearch}
              onClear={handleClearSearch}
              initialValue={activeSearch}
            />
          </div>
          <ProductFilter
            activeCategory={activeCat}
            activeSubcategory={activeSub}
            onSelect={handleCategorySelect}
            onSubSelect={handleSubcategorySelect}
          />
        </div>

        {/* Skeleton grid */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <p
            className="rounded-sm p-4 text-sm shadow-sm"
            style={{
              backgroundColor: 'var(--error-bg)',
              color: 'var(--error-text)',
              border: '1px solid var(--error-border)',
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="sk-loaded">
            <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
            <ProductGrid products={products} />
            {isSearchMode && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage(Math.max(page - 1, 0))}
                  disabled={!hasPrevious}
                  className="rounded-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--card-bg-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Previous
                </button>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={!hasNext}
                  className="rounded-full px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--card-bg-elevated)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
