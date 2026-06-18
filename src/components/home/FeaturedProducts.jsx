import { useNavigate } from "react-router-dom";
import { useFeaturedProducts } from "@/features/products/hooks/useFeaturedProducts";
import { formatCurrency } from "@/utils/currency";
import PATHS, { buildPath } from "@/routes/paths";

/* ── Skeleton ───────────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="min-w-[220px] snap-start overflow-hidden md:min-w-0"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="animate-pulse"
        style={{
          height: "160px",
          margin: "8px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, var(--featured-image-start) 0%, var(--featured-image-end) 100%)",
        }}
      />
      <div className="space-y-2 px-3 pb-3 pt-1">
        <div className="h-2.5 w-1/3 animate-pulse rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-3.5 w-3/4 animate-pulse rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-3.5 w-1/2 animate-pulse rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-4 w-1/3 animate-pulse rounded" style={{ backgroundColor: "var(--bg-tertiary)" }} />
        <div className="h-7 w-28 animate-pulse rounded-lg" style={{ backgroundColor: "var(--bg-tertiary)" }} />
      </div>
    </div>
  );
}

/* ── Inline rating ────────────────────────────────────────────────────────── */
function InlineRating({ rating = 0, count = 0 }) {
  if (!count || !rating) return null;
  const rounded = Math.round(rating * 10) / 10;
  return (
    <div className="inline-flex items-center gap-1" style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
      <span
        className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-bold text-white"
        style={{ backgroundColor: "#16a34a" }}
      >
        <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {rounded.toFixed(1)}
      </span>
      <span>({count})</span>
    </div>
  );
}

/* ── Featured card ──────────────────────────────────────────────────────────── */
function FeaturedCard({ product }) {
  const navigate = useNavigate();
  const openProduct = () => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id));

  return (
    <article
      className="group min-w-[220px] snap-start cursor-pointer overflow-hidden transition-all duration-[250ms] md:min-w-0"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
        borderRadius: "14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.13)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onClick={openProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && openProduct()}
    >
      {/* Image */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: "160px",
          margin: "8px",
          borderRadius: "10px",
          padding: "12px",
          background: "linear-gradient(135deg, var(--featured-image-start) 0%, var(--featured-image-end) 100%)",
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-[250ms] group-hover:scale-[1.04]"
            loading="lazy"
            width={280}
            height={160}
          />
        ) : (
          <span className="text-4xl">🛍️</span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 px-3 pb-3 pt-1">
        {/* Category */}
        <p
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--text-secondary)",
            lineHeight: 1,
          }}
        >
          {product.category || "Featured"}
        </p>

        {/* Name */}
        <h3
          className="line-clamp-2"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: 1.5,
            color: "var(--text-primary)",
          }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <InlineRating rating={product.averageRating} count={product.reviewCount || product.totalRatings} />

        {/* Price */}
        <p style={{ fontSize: "16px", fontWeight: 700, color: "#22c55e", lineHeight: 1 }}>
          {formatCurrency(product.price)}
        </p>

        {/* View Details */}
        <button
          type="button"
          className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-all duration-[250ms]"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
            borderRadius: "8px",
            padding: "5px 12px",
            border: "1px solid var(--border-color)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-tertiary)";
          }}
          onClick={(e) => {
            e.stopPropagation();
            openProduct();
          }}
        >
          View Details
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-[250ms] group-hover:translate-x-0.5"
          >
            →
          </span>
        </button>
      </div>
    </article>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────────── */
function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();
  const navigate = useNavigate();

  return (
    <section className="container-app py-6">
      {/* Banner shell — compact, not a hero */}
      <div
        className="overflow-hidden px-4 py-4 sm:px-6 sm:py-5"
        style={{
          background: "linear-gradient(180deg, var(--featured-shell-start) 0%, var(--featured-shell-end) 100%)",
          border: "1px solid var(--border-color)",
          borderRadius: "18px",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2
              className="text-xl font-bold sm:text-2xl"
              style={{ color: "var(--text-primary)", lineHeight: 1.3 }}
            >
              Featured Products
            </h2>
            <p
              className="mt-0.5 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Discover our most popular and trending products.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              padding: "5px 12px",
            }}
            onClick={() => navigate(PATHS.PRODUCTS)}
          >
            Browse All
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            className="rounded-xl border px-4 py-8 text-center text-sm"
            style={{
              backgroundColor: "var(--error-bg)",
              borderColor: "var(--error-border)",
              color: "var(--error-text)",
            }}
          >
            <p className="font-semibold">Could not load featured products.</p>
            <p className="mt-1" style={{ color: "var(--text-secondary)" }}>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div
            className="rounded-xl border px-4 py-8 text-center text-sm"
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

        {/* Cards grid */}
        {!loading && !error && products.length > 0 && (
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible xl:grid-cols-5">
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
