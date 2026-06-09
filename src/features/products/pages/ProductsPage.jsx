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

  const handleClearSearch = () => {
    fetchAll();
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      fetchAll();
    } else {
      fetchByCategory(category);
    }
  };

  return (
    <div className="page products-page">
      <div className="products-page__toolbar">
        <ProductSearch onSearch={handleSearch} onClear={handleClearSearch} />
        <ProductFilter
          activeCategory={activeCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      {loading && <p className="loading-text">Loading products...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && <ProductGrid products={products} />}
    </div>
  );
};

export default ProductsPage;