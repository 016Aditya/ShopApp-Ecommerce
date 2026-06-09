const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home", "Sports"];

const ProductFilter = ({ activeCategory, onSelect }) => {
  return (
    <div className="product-filter" role="group" aria-label="Filter by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`filter-chip ${activeCategory === cat ? "filter-chip--active" : ""}`}
          onClick={() => onSelect(cat)}
          aria-pressed={activeCategory === cat}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default ProductFilter;