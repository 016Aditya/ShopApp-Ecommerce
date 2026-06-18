import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFeaturedProducts } from "@/features/products/hooks/useFeaturedProducts";
import { useCartStore } from "@/store";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utils/currency";
import RatingBadge from "@/components/common/RatingBadge";
import PATHS, { buildPath } from "@/routes/paths";

/* ── Skeleton card ──────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="flex flex-col rounded-sm border overflow-hidden"
      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
    >
      <div
        className="h-44 w-full animate-pulse"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 rounded animate-pulse" style={{ width: "85%", backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-3 rounded animate-pulse" style={{ width: "60%", backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-3 rounded animate-pulse" style={{ width: "40%", backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-5 rounded animate-pulse mt-1" style={{ width: "50%", backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-9 rounded-sm animate-pulse mt-2" style={{ backgroundColor: "var(--bg-tertiary)" }} />
      </div>
    </div>
  );
}

/* ── Featured product card ──────────────────────────────────────────────── */
function FeaturedCard({ product }) {
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

  return (
    <div
      className="group flex flex-col rounded-sm border shadow-sm transition hover:shadow-md cursor-pointer"
      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
      onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
    >
      {/* Product Image */}
      <div
        className="flex h-44 items-center justify-center overflow-hidden"
        style={{ backgroundColor: "var(--bg-tertiary)" }}
      >
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

      <div className="flex flex-1 flex-col gap-1 p-3">
        {/* Product Name */}
        <h3
          className="line-clamp-2 group-hover:text-[#2874f0] transition"
          style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.4, color: "var(--text-primary)" }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-0.5">
          <RatingBadge rating={product.averageRating || 0} count={product.reviewCount || 0} />
        </div>

        {/* Price */}
        <p className="mt-1" style={{ fontSize: "18px", fontWeight: 700, color: "#22c55e" }}>
          {formatCurrency(product.price)}
        </p>

        {/* Category */}
        <span
          className="w-fit rounded-full px-2 py-0.5"
          style={{ fontSize: "13px", color: "var(--text-secondary)", backgroundColor: "var(--badge-bg)" }}
        >
          {product.category}
        </span>
      </div>

      {/* Add To Cart */}
      <div className="px-3 pb-3" onClick={(e) => e.stopPropagation()}>
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
}

/* ── FeaturedProducts section ───────────────────────────────────────────── */
function FeaturedProducts() {
  const { products, loading, error, usingFallback } = useFeaturedProducts();
  const navigate = useNavigate();

  return (
    <section className="container-app py-6">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            {usingFallback ? "Latest Products" : "Featured Products"}
          </h2>
          {usingFallback && (
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Showing our newest arrivals
            </p>
          )}
        </div>
        <button
          className="text-sm font-medium hover:underline"
          style={{ color: "#2874f0" }}
          onClick={() => navigate(PATHS.PRODUCTS)}
        >
          View all →
        </button>
      </div>

      {/* Loading — skeleton grid */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          className="flex flex-col items-center justify-center rounded-sm py-12 text-center"
          style={{
            backgroundColor: "var(--error-bg)",
            border: "1px solid var(--error-border)",
          }}
        >
          <span className="text-4xl mb-3">⚠️</span>
          <p className="font-semibold" style={{ color: "var(--error-text)" }}>
            Could not load products
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {error}
          </p>
          <button
            className="mt-4 rounded-sm px-6 py-2 text-sm font-bold text-white bg-[#ff9f00] hover:bg-[#e08e00] transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div
          className="flex flex-col items-center justify-center rounded-sm py-12 text-center"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
          <span className="text-5xl mb-3">🛍️</span>
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
            No products yet
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Products added from the admin panel will appear here.
          </p>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {products.map((product) => (
            <FeaturedCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;
