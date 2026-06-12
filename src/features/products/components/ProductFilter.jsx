// Category → subcategories map
const CATEGORY_MAP = {
  All:         [],
  Electronics: ["All Electronics", "Mobile", "Laptop", "TV", "Tablet", "Camera", "Headphones", "Gadgets"],
  Clothing:    ["All Clothing", "Shirt", "Jeans", "Dress", "Shoes", "Jacket", "Kurta"],
  Books:       ["All Books", "Textbook", "Novel", "Stationery", "Comics"],
  Home:        ["All Home", "Furniture", "Appliances", "Décor", "Kitchen"],
  Sports:      ["All Sports", "Cricket", "Football", "Gym", "Yoga"],
};

const TOP_CATEGORIES = Object.keys(CATEGORY_MAP);

const ProductFilter = ({ activeCategory, activeSubcategory, onSelect, onSubSelect }) => {
  const subs = CATEGORY_MAP[activeCategory] ?? [];

  return (
    <div className="flex flex-col gap-2">
      {/* ── Top-level categories ──────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {TOP_CATEGORIES.map((cat) => (
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

      {/* ── Subcategory chips (only when a category is selected) ─────── */}
      {activeCategory !== "All" && subs.length > 0 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by subcategory">
          {subs.map((sub) => {
            const key = sub.startsWith("All ") ? null : sub;
            const isActive =
              sub.startsWith("All ") ? !activeSubcategory : activeSubcategory === key;
            return (
              <button
                key={sub}
                onClick={() => onSubSelect?.(key)}
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  isActive
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductFilter;