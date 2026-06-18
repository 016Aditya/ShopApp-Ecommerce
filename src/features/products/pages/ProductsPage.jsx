import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import ProductSearch from "../components/ProductSearch";
import ProductFilter from "../components/ProductFilter";

/**
 * ProductsPage
 *
 * Single source of truth: URL search params drive everything.
 * All navigation handlers are memoised and only update the specific
 * param(s) they own — no handler ever wipes unrelated params.
 *
 * Handler contracts
 * ─────────────────
 * handleSearch(keyword)
 *   Merges ?search=keyword into existing params (preserves category).
 *   Clears ?subcategory when a new search starts.
 *   Guard: skips setSearchParams when the URL already has this value.
 *
 * handleClearSearch()
 *   Removes ONLY the ?search param. Category + subcategory are preserved.
 *   Guard: skips when there is no search param to remove.
 *
 * handleCategorySelect(category)
 *   Replaces the entire param set with just ?category= (or {} for "All").
 *   A category click always resets search and subcategory — intentional.
 *
 * handleSubcategorySelect(sub)
 *   Keeps ?category= and replaces/removes ?subcategory=.
 */
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

  const handleSearch = useCallback(
    (keyword) => {
      // Guard: skip if URL already has this exact search value.
      if (searchParams.get("search") === keyword) return;

      // Merge search into current params — preserve ?category=.
      // Clear ?subcategory so the search isn't accidentally scoped.
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (keyword) {
          next.set("search", keyword);
          next.delete("subcategory"); // search overrides subcategory
        } else {
          next.delete("search");
        }
        return next;
      });
    },
    [searchParams, setSearchParams]
  );

  const handleClearSearch = useCallback(() => {
    // Guard: skip if there is no search param — avoids a no-op navigation
    // that would still trigger a re-render cycle.
    if (!searchParams.has("search")) return;

    // Remove ONLY the search key; preserve category + subcategory.
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("search");
      return next;
    });
  }, [searchParams, setSearchParams]);

  const handleCategorySelect = useCallback(
    (category) => {
      // Category click is a deliberate reset — clear search + subcategory.
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

              The mountedRef inside ProductSearch ensures this remount does
              NOT fire onClear automatically — solving the param-wipe loop.
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
