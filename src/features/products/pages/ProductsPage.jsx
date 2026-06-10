import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import ProductSearch from "../components/ProductSearch";
import ProductFilter from "../components/ProductFilter";

const ProductsPage = () => {
  const { products, loading, error, fetchAll, fetchByCategory, fetchBySearch } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchParams] = useSearchParams();

  // Read ?category= and ?search= from URL on mount
  useEffect(() => {
    const cat = searchParams.get("category");
    const search = searchParams.get("search");
    if (search) {
      fetchBySearch(search);
    } else if (cat) {
      setActiveCategory(cat);
      fetchByCategory(cat);
    } else {
      fetchAll();
    }
  }, [searchParams]);

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
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="container-app py-6">
        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 rounded-sm bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <ProductSearch onSearch={handleSearch} onClear={handleClearSearch} />
          <ProductFilter activeCategory={activeCategory} onSelect={handleCategorySelect} />
        </div>

        {/* States */}
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
        {!loading && !error && <ProductGrid products={products} />}
      </div>
    </div>
  );
};

export default ProductsPage;
