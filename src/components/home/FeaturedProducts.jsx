import { useNavigate } from "react-router-dom";
import { useFeaturedProducts } from "@/features/products/hooks/useFeaturedProducts";
import { formatCurrency } from "@/utils/currency";
import PATHS, { buildPath } from "@/routes/paths";

function SkeletonCard() {
  return (
    <div
      className="min-w-[280px] snap-start overflow-hidden rounded-[20px] border md:min-w-0"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="h-[220px] animate-pulse rounded-[20px] rounded-b-none"
        style={{
          background:
            "linear-gradient(135deg, var(--featured-image-start) 0%, var(--featured-image-end) 100%)",
        }}
      />
      <div className="space-y-3 p-5">
        <div
          className="h-4 w-3/4 animate-pulse rounded-full"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        />
        <div
          className="h-3 w-1/3 animate-pulse rounded-full"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        />
        <div
          className="h-5 w-1/2 animate-pulse rounded-full"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        />
        <div
          className="h-10 w-full animate-pulse rounded-full"
          style={{ backgroundColor: "var(--bg-tertiary)" }}
        />
      </div>
    </div>
  );
}

function FeaturedRating({ rating = 0, count = 0 }) {
  if (!count || !rating) {
    return (
      <span
        className="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold"
        style={{
          backgroundColor: "var(--badge-bg)",
          color: "var(--text-secondary)",
        }}
      >
        New Arrival
      </span>
    );
  }

  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
      <span
        className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white"
        style={{
          background: "linear-gradient(135deg, #16a34a, #15803d)",
          boxShadow: "0 10px 20px rgba(21, 128, 61, 0.24)",
        }}
      >
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {roundedRating.toFixed(1)}
      </span>
      <span style={{ color: "var(--text-secondary)" }}>({count})</span>
    </div>
  );
}

function FeaturedCard({ product }) {
  const navigate = useNavigate();

  const openProduct = () => {
    navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id));
  };

  return (
    <article
      className="group min-w-[280px] snap-start overflow-hidden rounded-[20px] border shadow-[var(--shadow-md)] transition duration-200 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-[var(--shadow-lg)] md:min-w-0"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border-color)",
      }}
      onClick={openProduct}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => event.key === "Enter" && openProduct()}
    >
      <div
        className="relative m-3 flex h-[220px] items-center justify-center overflow-hidden rounded-[18px] p-5"
        style={{
          background:
            "linear-gradient(135deg, var(--featured-image-start) 0%, var(--featured-image-end) 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-4 h-8 rounded-full blur-2xl"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.12)" }}
        />
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="relative h-full w-full object-contain transition duration-300 group-hover:scale-105"
            style={{ mixBlendMode: "var(--featured-image-blend)" }}
            loading="lazy"
            width={360}
            height={220}
          />
        ) : (
          <span
            className="relative text-sm font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--text-secondary)" }}
          >
            No Image
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pb-5 pt-1">
        <div className="space-y-2">
          <p
            className="text-xs font-medium uppercase tracking-[0.18em]"
            style={{ color: "var(--text-secondary)" }}
          >
            {product.category || "Featured"}
          </p>
          <h3
            className="line-clamp-2"
            style={{
              color: "var(--text-primary)",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-3">
          <FeaturedRating rating={product.averageRating} count={product.reviewCount} />
          <p style={{ color: "#22c55e", fontSize: "22px", fontWeight: 700 }}>
            {formatCurrency(product.price)}
          </p>
        </div>

        <button
          type="button"
          className="mt-auto inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 group-hover:translate-x-1"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-primary)",
          }}
          onClick={(event) => {
            event.stopPropagation();
            openProduct();
          }}
        >
          View Details
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts();
  const navigate = useNavigate();

  return (
    <section className="container-app py-8 md:py-10">
      <div
        className="overflow-hidden rounded-[28px] border px-4 py-6 sm:px-6 lg:px-8"
        style={{
          background:
            "linear-gradient(180deg, var(--featured-shell-start) 0%, var(--featured-shell-end) 100%)",
          borderColor: "var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold md:text-3xl" style={{ color: "var(--text-primary)" }}>
              Featured Products
            </h2>
            <p className="mt-2 text-sm md:text-base" style={{ color: "var(--text-secondary)" }}>
              Discover our most popular and trending products.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
            onClick={() => navigate(PATHS.PRODUCTS)}
          >
            Browse all
            <span aria-hidden="true">→</span>
          </button>
        </div>

        {loading && (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div
            className="rounded-[20px] border px-6 py-12 text-center"
            style={{
              backgroundColor: "var(--error-bg)",
              borderColor: "var(--error-border)",
              color: "var(--error-text)",
            }}
          >
            <p className="text-lg font-semibold">Could not load featured products.</p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {error}
            </p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div
            className="rounded-[20px] border px-6 py-12 text-center"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              borderColor: "var(--border-color)",
            }}
          >
            <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Featured products will appear here soon.
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              Check back after new collections are added.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:overflow-visible xl:grid-cols-4 2xl:grid-cols-5">
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
