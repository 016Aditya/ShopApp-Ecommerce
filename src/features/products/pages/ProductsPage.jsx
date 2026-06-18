import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import ProductSearch from "../components/ProductSearch";
import ProductFilter from "../components/ProductFilter";

const ProductsPage = () => {
  const {
    products,
    loading,
    error,
    fetchAll,
    fetchByCategory,
    fetchByCategoryAndSubcategory,
    fetchBySearch,
  } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();

  const activeCat    = searchParams.get("category")    ?? "All";
  const activeSub    = searchParams.get("subcategory") ?? null;
  const activeSearch = searchParams.get("search")      ?? "";

  // ── Fetch when URL params change ──────────────────────────────────────
  // Depend on the serialised string so the effect is stable and only runs
  // when an actual URL value changes (not on every render).
  useEffect(() => {
    if (activeSearch) {
      fetchBySearch(activeSearch);
    } else if (activeSub) {
      fetchByCategoryAndSubcategory(activeCat, activeSub);
    } else if (activeCat !== "All") {
      fetchByCategory(activeCat);
    } else {
      fetchAll();
    }
    // fetchAll / fetchByCategory etc. are stable useCallback refs from
    // useProducts — safe to omit from the array; the serialised
    // searchParams string is the only real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // ── Stable handlers ───────────────────────────────────────────────────
  // Every handler is memoised. Without useCallback these are new function
  // objects every render, which makes ProductSearch's useEffect (which
  // stored them in a ref) call onSearch on every render → infinite loop.

  const handleSearch = useCallback(
    (keyword) => {
      // Guard: skip setSearchParams if the URL already has this value.
      // This is the primary loop-breaker.
      if (searchParams.get("search") === keyword) return;
      setSearchParams(keyword ? { search: keyword } : {});
    },
    // searchParams object ref changes every render, so read .get() inside
    // the callback and list searchParams itself as the dep.
    [searchParams, setSearchParams]
  );

  const handleClearSearch = useCallback(() => {
    // Guard: skip if already empty to avoid a no-op navigation.
    if (!searchParams.toString()) return;
    setSearchParams({});
  }, [searchParams, setSearchParams]);

  const handleCategorySelect = useCallback(
    (category) => {
      setSearchParams(category === "All" ? {} : { category });
    },
    [setSearchParams]
  );

  const handleSubcategorySelect = useCallback(
    (sub) => {
      if (!sub) {
        setSearchParams(activeCat !== "All" ? { category: activeCat } : {});
        return;
      }
      setSearchParams({ category: activeCat, subcategory: sub });
    },
    [activeCat, setSearchParams]
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="container-app py-6">
        {(activeCat !== "All" || activeSearch) && (
          <div
            className="mb-3 flex items-center gap-2 rounded-sm px-4 py-2 text-sm shadow-sm"
            style={{
              backgroundColor: "var(--card-bg-elevated)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            {activeSearch ? (
              <>
                <span className="font-semibold">Search:</span> &ldquo;{activeSearch}&rdquo;
              </>
            ) : (
              <>
                <span className="font-semibold">Category:</span> {activeCat}
                {activeSub ? ` > ${activeSub}` : ""}
              </>
            )}
            <button
              onClick={handleClearSearch}
              className="ml-auto text-xs font-medium hover:underline"
              style={{ color: "var(--info-text)" }}
            >
              Clear x
            </button>
          </div>
        )}

        <div
          className="mb-4 flex flex-col gap-3 rounded-sm p-4 shadow-sm"
          style={{
            backgroundColor: "var(--card-bg-elevated)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/*
              key={activeSearch} — when the search param changes externally
              (e.g. user clicks a category or Clear), React unmounts and
              remounts ProductSearch with the correct initialValue instead
              of trying to sync it through a useEffect inside the child.
              This eliminates the secondary loop:
                initialValue changes → setInput → debounce fires → onSearch
                → setSearchParams → re-render → initialValue changes → …
            */}
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

        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-sm shadow-sm"
                style={{
                  backgroundColor: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                }}
              />
            ))}
          </div>
        )}

        {error && (
          <p
            className="rounded-sm p-4 text-sm shadow-sm"
            style={{
              backgroundColor: "var(--error-bg)",
              color: "var(--error-text)",
              border: "1px solid var(--error-border)",
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <p className="mb-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
            <ProductGrid products={products} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
