import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import ProductSearch from "../components/ProductSearch";
import ProductFilter from "../components/ProductFilter";
import { ProductCardSkeleton } from "@/components/skeleton";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const handleSearch = useCallback(
    (keyword) => {
      if (searchParams.get("search") === keyword) return;
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (keyword) {
          next.set("search", keyword);
          next.delete("subcategory");
        } else {
          next.delete("search");
        }
        return next;
      });
    },
    [searchParams, setSearchParams]
  );

  const handleClearSearch = useCallback(() => {
    if (!searchParams.has("search")) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("search");
      return next;
    });
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

        {/* ── Skeleton grid ── */}
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
              backgroundColor: "var(--error-bg)",
              color: "var(--error-text)",
              border: "1px solid var(--error-border)",
            }}
          >
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="sk-loaded">
            <p className="mb-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
            <ProductGrid products={products} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
