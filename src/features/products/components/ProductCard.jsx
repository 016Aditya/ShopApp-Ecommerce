import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PATHS, { buildPath } from "@/routes/paths";
import { useCartStore } from "@/store";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utils/currency";
import RatingBadge from "@/components/common/RatingBadge";

const ProductCard = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [busy, setBusy]   = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) { navigate(PATHS.LOGIN); return; }
    setBusy(true);
    try {
      await useCartStore.getState().addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setBusy(false);
    }
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  /* ─── COMPACT variant ─── */
  if (compact) {
    return (
      <div
        className="group flex cursor-pointer flex-col items-center rounded-sm border p-3 hover:shadow-md transition"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
        onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
      >
        {/* Image container — fixed height, image sits inside with padding */}
        <div
          className="flex h-32 w-full items-center justify-center rounded mb-2 overflow-hidden relative"
          style={{ backgroundColor: "var(--bg-tertiary)", padding: "10px" }}
        >
          {discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
              {discount}% OFF
            </div>
          )}
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
              loading="lazy"
            />
          ) : (
            <span className="text-4xl">🛍️</span>
          )}
        </div>

        <p
          className="text-center line-clamp-2 group-hover:text-[#2874f0] transition"
          style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.4, color: "var(--text-primary)" }}
        >
          {product.name}
        </p>
        <div className="mt-1 w-full">
          <RatingBadge rating={product.averageRating || 0} count={product.reviewCount || 0} showCount={false} />
        </div>
        <p className="mt-1 font-bold" style={{ fontSize: "18px", fontWeight: 700, color: "#22c55e" }}>
          {formatCurrency(product.price)}
        </p>
      </div>
    );
  }

  /* ─── STANDARD grid card ─── */
  return (
    <div
      className="group flex cursor-pointer flex-col rounded-sm border shadow-sm transition hover:shadow-md"
      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
      onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
    >
      {/*
        Image container — fixed height box.
        padding: 14px gives a visible background margin on all 4 sides,
        so no image ever bleeds to the card edge regardless of aspect ratio.
        The <img> uses max-height/max-width with auto dimensions so it
        scales down to fit inside the padded area without ever being
        stretched, cropped, or filling the full box.
      */}
      <div
        className="flex h-44 w-full items-center justify-center overflow-hidden relative"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          padding: "14px",
        }}
      >
        {discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
            {discount}% OFF
          </div>
        )}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
              transition: "transform 0.2s ease",
            }}
            className="group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="text-6xl">🛍️</span>
        )}
      </div>

      {/* ── Product info ── */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3
          className="line-clamp-2 group-hover:text-[#2874f0] transition"
          style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.4, color: "var(--text-primary)" }}
        >
          {product.name}
        </h3>

        <div className="mt-0.5">
          <RatingBadge rating={product.averageRating || 0} count={product.reviewCount || 0} />
        </div>

        <div className="mt-1 flex items-baseline gap-2">
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#22c55e" }}>
            {formatCurrency(product.price)}
          </p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-xs line-through" style={{ color: "var(--text-tertiary)" }}>
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>

        <p className="text-xs font-semibold text-green-500">✓ Free Delivery</p>

        {product.inStock === false && (
          <p className="text-xs font-semibold text-red-500">Out of Stock</p>
        )}

        <div className="flex items-center gap-1 flex-wrap">
          <span
            className="w-fit rounded-full px-2 py-0.5"
            style={{ fontSize: "13px", color: "var(--text-secondary)", backgroundColor: "var(--badge-bg)" }}
          >
            {product.category}
          </span>
          {product.subcategory && (
            <span
              className="w-fit rounded-full px-2 py-0.5"
              style={{ fontSize: "10px", color: "var(--text-secondary)", backgroundColor: "var(--badge-bg)" }}
            >
              {product.subcategory}
            </span>
          )}
        </div>
      </div>

      {/* ── Add to Cart ── */}
      <div className="px-3 pb-3">
        <button
          className={`w-full rounded-sm py-2 text-sm font-bold text-white transition active:scale-95 ${
            added ? "bg-green-600"
            : busy ? "bg-[#ff9f00]/70 cursor-not-allowed"
            : product.inStock === false ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#ff9f00] hover:bg-[#e08e00]"
          }`}
          onClick={handleAddToCart}
          disabled={busy || product.inStock === false}
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? "✓ Added!" : busy ? "Adding..." : product.inStock === false ? "OUT OF STOCK" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
