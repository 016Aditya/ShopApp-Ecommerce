import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import PATHS, { buildPath } from "@/routes/paths";
import CartContext from "@/features/cart/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utils/currency";
import RatingBadge from "@/components/common/RatingBadge";

const ProductCard = ({ product, compact = false }) => {
  const navigate   = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user }   = useAuth();
  const [added, setAdded] = useState(false);
  const [busy, setBusy]   = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate(PATHS.LOGIN);
      return;
    }
    setBusy(true);
    try {
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setBusy(false);
    }
  };

  // Calculate discount if applicable
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (compact) {
    return (
      <div
        className="group flex cursor-pointer flex-col items-center rounded-sm border border-slate-100 bg-white p-3 hover:shadow-md transition"
        onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
        role="button"
        tabIndex={0}
        onKeyDown={(e) =>
          e.key === "Enter" && navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))
        }
      >
        <div className="flex h-32 w-full items-center justify-center rounded bg-slate-50 mb-2 overflow-hidden relative">
          {discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-4xl">🛍️</span>
          )}
        </div>
        <p className="text-xs font-semibold text-slate-800 text-center line-clamp-2 group-hover:text-[#2874f0]">
          {product.name}
        </p>
        <div className="mt-1 w-full">
          <RatingBadge 
            rating={product.averageRating || 0} 
            count={product.reviewCount || 0}
            showCount={false}
          />
        </div>
        <p className="mt-1 text-sm font-bold text-slate-900">{formatCurrency(product.price)}</p>
      </div>
    );
  }

  return (
    <div
      className="group flex cursor-pointer flex-col rounded-sm border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
      onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))
      }
    >
      {/* Image */}
      <div className="flex h-44 items-center justify-center bg-slate-50 overflow-hidden relative">
        {discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
            {discount}% OFF
          </div>
        )}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain p-3 transition group-hover:scale-105"
            loading="lazy"
            width={300}
            height={176}
          />
        ) : (
          <span className="text-6xl">🛍️</span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-800 group-hover:text-[#2874f0] transition">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="mt-0.5">
          <RatingBadge 
            rating={product.averageRating || 0} 
            count={product.reviewCount || 0}
          />
        </div>

        {/* Price */}
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-base font-bold text-slate-900">{formatCurrency(product.price)}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs text-slate-500 line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Free Delivery Badge */}
        <p className="text-xs text-green-600 font-semibold">✓ Free Delivery</p>

        {/* Stock Status */}
        {product.inStock === false && (
          <p className="text-xs text-red-600 font-semibold">Out of Stock</p>
        )}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="w-fit rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
            {product.category}
          </span>
          {product.subcategory && (
            <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              {product.subcategory}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 pb-3">
        <button
          className={`w-full rounded-sm py-2 text-sm font-bold text-white transition active:scale-95 ${
            added
              ? "bg-green-600"
              : busy
              ? "bg-[#ff9f00]/70 cursor-not-allowed"
              : "bg-[#ff9f00] hover:bg-[#e08e00]"
          }`}
          onClick={handleAddToCart}
          disabled={busy}
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? "✓ Added!" : busy ? "Adding..." : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
