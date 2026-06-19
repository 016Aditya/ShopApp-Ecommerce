import { useNavigate } from "react-router-dom";
import { useFeaturedProducts } from "@/features/products/hooks/useFeaturedProducts";
import { formatCurrency } from "@/utils/currency";
import PATHS, { buildPath } from "@/routes/paths";

/* ── Skeleton ────────────────────────────────────────────────────────────────────────────── */
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
          height: "140px",
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

/* ── Inline rating ──────────────────────────────────────────────────────────────────────────── */
function InlineRating({ rating = 0, count = 0 }) {
  if (!count || !rating) return null;
  const rounded = Math.round(rating * 10) / 10;
  return (
    <div
      className="inline-flex items-center gap-1"
      style={{ color: "var(--text-secondary)", fontSize: "11px" }}
    >
      <span
        className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-bold text-white"
        style={{ backgroundColor: "#16a34a", fontSize: "11px" }}
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

/* ── Featured card ────────────────────────────────────────────────────────────────────────────── */
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
      {/* Image — reduced from 160px → 144px */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: "144px",
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
            height={144}
          />
        ) : (
          <span className="text-4xl" aria-hidden="true">🛒</span>
        )}
      </div>

      {/* Content — reduced pb-3 → pb-2.5, gap-2 → gap-1.5 */}
      <div className="flex flex-col gap-1.5 px-3 pb-2.5 pt-1">
        {/* Category */}
        {product.category && (
          <span
            className="truncate text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            {product.category}
          </span>
        )}

        {/* Name */}
        <p
          className="line-clamp-2 text-sm font-semibold leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {product.name}
        </p>

        {/* Rating */}
        <InlineRating rating={product.rating} count={product.reviewCount} />

        {/* Price */}
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-base font-extrabold" style={{ color: "var(--text-primary)" }}>
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span
                className="text-xs line-through"
                style={{ color: "var(--text-tertiary)" }}
              >
                {formatCurrency(product.originalPrice)}
              </span>
              <span className="text-xs font-bold" style={{ color: "#16a34a" }}>
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </span>
            </>
          )}
        </div>

        {/* CTA */}
        <button
          className="mt-0.5 w-full rounded-md py-1.5 text-xs font-bold transition-opacity hover:opacity-90"
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

/* ── Section ──────────────────────────────────────────────────────────────────────────────────── */
function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();
  const navigate = useNavigate();

  return (
    /* py-5 replaces py-6 — tighter vertical rhythm on the page */
    <section className="container-app py-5">
      {/* Shell — px/py tightened ~8% vs previous */}
      <div
        className="overflow-hidden px-3.5 py-3.5 sm:px-5 sm:py-4"
        style={{
          background:
            "linear-gradient(180deg, var(--featured-shell-start) 0%, var(--featured-shell-end) 100%)",
          border: "1px solid var(--border-color)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* Header row */}
        <div className="mb-3 flex items-center justify-between gap-4">
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
          <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible xl:grid-cols-5">
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

        {/* Cards grid — gap-2.5 replaces gap-3 */}
        {!loading && !error && products.length > 0 && (
          <div className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible xl:grid-cols-5">
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
