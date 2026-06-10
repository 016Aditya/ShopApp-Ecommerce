import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import PATHS, { buildPath } from "@/routes/paths";
import CartContext from "@/features/cart/context/CartContext";
import { formatCurrency } from "@/utils/currency";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  return (
    <div
      className="group flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
      onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
    >
      {/* Image placeholder */}
      <div className="flex h-44 items-center justify-center rounded-t-2xl bg-slate-50">
        <svg className="h-16 w-16 text-slate-200" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="m3 9 4-4 4 4 4-4 4 4" />
          <circle cx="8.5" cy="13.5" r="1.5" />
        </svg>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="w-fit rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
          {product.category}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 text-base font-bold text-slate-900">
          {formatCurrency(product.price)}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <button
          className="w-full rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
