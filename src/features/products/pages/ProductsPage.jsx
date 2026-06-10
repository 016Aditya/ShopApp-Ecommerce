import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import ProductSearch from "../components/ProductSearch";
import ProductFilter from "../components/ProductFilter";

const ProductsPage = () => {
  const { products, loading, error, fetchAll, fetchByCategory, fetchBySearch } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");

  const handleSearch = (keyword) => {
    setActiveCategory("All");
    fetchBySearch(keyword);
  };

  const handleClearSearch = () => fetchAll();

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    category === "All" ? fetchAll() : fetchByCategory(category);
  };

  return (
    <div className="container-app py-8">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProductSearch onSearch={handleSearch} onClear={handleClearSearch} />
        <ProductFilter activeCategory={activeCategory} onSelect={handleCategorySelect} />
      </div>

      {/* States */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-slate-100 h-64" />
          ))}
        </div>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</p>
      )}
      {!loading && !error && <ProductGrid products={products} />}
    </div>
  );
};

export default ProductsPage;
