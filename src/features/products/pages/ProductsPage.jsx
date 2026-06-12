import { useState, useEffect } from "react";
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

  const activeCat = searchParams.get("category") ?? "All";
  const activeSub = searchParams.get("subcategory") ?? null;
  const activeSearch = searchParams.get("search") ?? "";

  // Sync URL params → API call whenever params change
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

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleSearch = (keyword) => {
    setSearchParams(keyword ? { search: keyword } : {});
  };

  const handleClearSearch = () => setSearchParams({});

  const handleCategorySelect = (category) => {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const handleSubcategorySelect = (sub) => {
    if (!sub) {
      // "All Electronics" etc — clear subcategory, keep category
      setSearchParams(activeCat !== "All" ? { category: activeCat } : {});
    } else {
      setSearchParams({ category: activeCat, subcategory: sub });
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="container-app py-6">

        {/* ── Active filter badge ───────────────────────────────────────── */}
        {(activeCat !== "All" || activeSearch) && (
          <div className="mb-3 flex items-center gap-2 rounded-sm bg-blue-50 px-4 py-2 text-sm text-blue-700 shadow-sm">
            {activeSearch ? (
              <><span className="font-semibold">Search:</span> &ldquo;{activeSearch}&rdquo;</>
            ) : (
              <><span className="font-semibold">Category:</span> {activeCat}{activeSub ? ` › ${activeSub}` : ""}</>
            )}
            <button
              onClick={handleClearSearch}
              className="ml-auto text-xs font-medium text-blue-500 hover:underline"
            >
              Clear ✕
            </button>
          </div>
        )}

        {/* ── Toolbar ───────────────────────────────────────────────────── */}
        <div className="mb-4 flex flex-col gap-3 rounded-sm bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <ProductSearch
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

        {/* ── Grid / states ─────────────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-sm bg-white h-72 shadow-sm" />
            ))}
          </div>
        )}
        {error && (
          <p className="rounded-sm bg-red-50 p-4 text-sm text-red-600 shadow-sm">{error}</p>
        )}
        {!loading && !error && (
          <>
            <p className="mb-3 text-sm text-slate-500">
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