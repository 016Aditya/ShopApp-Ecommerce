import { useNavigate } from "react-router-dom";
import { useFeaturedProducts } from "@/features/products/hooks/useFeaturedProducts";
import { formatCurrency } from "@/utils/currency";
import RatingBadge from "@/components/common/RatingBadge";
import PATHS, { buildPath } from "@/routes/paths";

/* ── Skeleton ──────────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="min-w-[200px] snap-start overflow-hidden md:min-w-0"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      }}
    >
      <div
        className="animate-pulse"
        style={{
          height: "148px",
          margin: "7px",
          borderRadius: "8px",
          background:
            "linear-gradient(135deg, var(--featured-image-start) 0%, var(--featured-image-end) 100%)",
        }}
      />
      <div className="space-y-1.5 px-3 pb-3 pt-1">
        <div className="h-2 w-1/3 animate-pulse rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-3 w-3/4 animate-pulse rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-3 w-1/2 animate-pulse rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-3.5 w-1/3 animate-pulse rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-6 w-24 animate-pulse rounded-md" style={{ backgroundColor: "var(--bg-tertiary)" }} />
      </div>
    </div>
  );
}

/* ── Featured card ─────────────────────────────────────────────────────────── */
function FeaturedCard({ product }) {
  const navigate = useNavigate();
  const openProduct = () => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id));

  return (
    <article
      className="group min-w-[200px] snap-start cursor-pointer overflow-hidden transition-all duration-[220ms] md:min-w-0"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";
      }}
      onClick={openProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && openProduct()}
    >
      {/* Image — 152px (+6% from 144px) */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: "152px",
          margin: "7px",
          borderRadius: "8px",
          padding: "10px",
          background:
            "linear-gradient(135deg, var(--featured-image-start) 0%, var(--featured-image-end) 100%)",
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-[220ms] group-hover:scale-[1.04]"
            loading="lazy"
            width={260}
            height={152}
          />
        ) : (
          <span className="text-4xl" aria-hidden="true">🛒</span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 px-3 pb-3 pt-1.5">
        {/* Name */}
        <p
          className="line-clamp-2 text-sm font-semibold leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {product.name}
        </p>

        {/* Rating — uses same RatingBadge as ProductCard */}
        <div className="mt-0.5">
          <RatingBadge
            rating={product.averageRating || 0}
            count={product.totalRatings || 0}
          />
        </div>

        {/* Price — green, same as ProductCard */}
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span style={{ fontSize: "17px", fontWeight: 700, color: "#22c55e" }}>
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs line-through" style={{ color: "var(--text-tertiary)" }}>
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Free Delivery — same as ProductCard */}
        <p className="text-xs font-semibold text-green-500">✓ Free Delivery</p>

        {/* Category chips — same as ProductCard */}
        {(product.category || product.subcategory) && (
          <div className="flex flex-wrap items-center gap-1">
            {product.category && (
              <span
                className="w-fit rounded-full px-2 py-0.5"
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--badge-bg)",
                }}
              >
                {product.category}
              </span>
            )}
            {product.subcategory && (
              <span
                className="w-fit rounded-full px-2 py-0.5"
                style={{
                  fontSize: "10px",
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--badge-bg)",
                }}
              >
                {product.subcategory}
              </span>
            )}
          </div>
        )}

        {/* CTA — unchanged */}
        <button
          className="mt-1 w-full rounded-md py-1.5 text-xs font-bold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--button-primary)",
            color: "var(--button-primary-text)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            openProduct();
          }}
          aria-label={`View ${product.name}`}
        >
          View Details
        </button>
      </div>
    </article>
  );
}

/* ── Section ───────────────────────────────────────────────────────────────── */
function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();
  const navigate = useNavigate();

  return (
    /* py-5 → py-[21px] (+6%) */
    <section className="container-app" style={{ paddingTop: "21px", paddingBottom: "21px" }}>
      {/* Shell — px/py scaled +6% */}
      <div
        className="overflow-hidden"
        style={{
          padding: "15px 22px",
          background:
            "linear-gradient(180deg, var(--featured-shell-start) 0%, var(--featured-shell-end) 100%)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Header row — mb-3 → mb-[13px] (+6%) */}
        <div
          className="flex items-center justify-between gap-4"
          style={{ marginBottom: "13px" }}
        >
          <div>
            <h2
              className="text-lg font-bold sm:text-xl"
              style={{ color: "var(--text-primary)", lineHeight: 1.3 }}
            >
              Featured Products
            </h2>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-secondary)" }}>
              Discover our most popular and trending products.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "7px",
              padding: "4px 11px",
            }}
            onClick={() => navigate(PATHS.PRODUCTS)}
          >
            Browse All
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex snap-x snap-mandatory gap-[11px] overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="rounded-xl border px-4 py-6 text-center text-sm"
            style={{
              backgroundColor: "var(--error-bg)",
              borderColor: "var(--error-border)",
              color: "var(--error-text)",
            }}
          >
            <p className="font-semibold">Could not load featured products.</p>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div
            className="rounded-xl border px-4 py-6 text-center text-sm"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              borderColor: "var(--border-color)",
            }}
          >
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Featured products will appear here soon.
            </p>
          </div>
        )}

        {/* Cards grid — gap-2.5 → gap-[11px] (+6%) */}
        {!loading && !error && products.length > 0 && (
          <div className="flex snap-x snap-mandatory gap-[11px] overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible xl:grid-cols-5">
            {products.map((product) => (
              <FeaturedCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
