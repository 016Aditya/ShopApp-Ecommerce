const CATEGORIES = ["All", "Electronics", "Clothing", "Books", "Home", "Sports"];

const ProductFilter = ({ activeCategory, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          aria-pressed={activeCategory === cat}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === cat
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default ProductFilter;
