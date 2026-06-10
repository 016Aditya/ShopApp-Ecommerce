import { Link } from "react-router-dom";
import PATHS from "@/routes/paths";

const CATEGORIES = [
  { label: "For You", icon: "🏠", path: PATHS.HOME },
  { label: "Fashion", icon: "👕", path: `${PATHS.PRODUCTS}?category=Clothing` },
  { label: "Mobiles", icon: "📱", path: `${PATHS.PRODUCTS}?category=Electronics` },
  { label: "Electronics", icon: "💻", path: `${PATHS.PRODUCTS}?category=Electronics` },
  { label: "Home", icon: "🛋️", path: `${PATHS.PRODUCTS}?category=Home` },
  { label: "Books", icon: "📚", path: `${PATHS.PRODUCTS}?category=Books` },
  { label: "Sports", icon: "⚽", path: `${PATHS.PRODUCTS}?category=Sports` },
  { label: "All Products", icon: "🛒", path: PATHS.PRODUCTS },
];

function CategoryBar() {
  return (
    <div className="border-b border-slate-200 bg-white shadow-sm">
      <div className="container-app">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              className="flex flex-shrink-0 flex-col items-center gap-1 px-5 py-3 text-slate-700 hover:text-[#2874f0] border-b-2 border-transparent hover:border-[#2874f0] transition-all"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="whitespace-nowrap text-xs font-medium">{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryBar;
