import "./skeletons.css";

/**
 * Matches the ProductDetailPage 3-column grid:
 *   col 1 – image gallery
 *   col 2 – product info (title, rating, price, description, specs)
 *   col 3 – purchase card
 */
const ProductDetailSkeleton = () => (
  <div className="pdp-page" aria-hidden="true">
    {/* Back button placeholder */}
    <div className="sk mb-4" style={{ height: 14, width: 130 }} />

    {/* Breadcrumb */}
    <div className="sk mb-6" style={{ height: 12, width: 280 }} />

    <div className="pdp-grid">
      {/* ── Image gallery col ── */}
      <div className="pdp-grid__images">
        <div className="sk w-full" style={{ aspectRatio: "1 / 1", borderRadius: 8 }} />
        {/* Thumbnail strip */}
        <div className="flex gap-2 mt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="sk" style={{ width: 56, height: 56, borderRadius: 6 }} />
          ))}
        </div>
      </div>

      {/* ── Product info col ── */}
      <div className="pdp-grid__info">
        {/* Brand badge */}
        <div className="sk mb-3" style={{ height: 20, width: 80, borderRadius: 999 }} />
        {/* Title */}
        <div className="sk mb-2" style={{ height: 22 }} />
        <div className="sk mb-4" style={{ height: 22, width: "75%" }} />
        {/* Rating */}
        <div className="sk mb-4" style={{ height: 24, width: 160, borderRadius: 999 }} />
        {/* Price */}
        <div className="flex gap-3 items-center mb-4">
          <div className="sk" style={{ height: 28, width: 100 }} />
          <div className="sk" style={{ height: 18, width: 70 }} />
          <div className="sk" style={{ height: 18, width: 55, borderRadius: 4 }} />
        </div>
        {/* Description heading */}
        <div className="sk mb-2" style={{ height: 16, width: 110 }} />
        {/* Description lines */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="sk mb-2" style={{ height: 13, width: i % 2 === 0 ? "100%" : "85%" }} />
        ))}
        {/* Specs */}
        <div className="sk mt-4 mb-2" style={{ height: 16, width: 120 }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 mb-2">
            <div className="sk" style={{ height: 13, width: "35%" }} />
            <div className="sk" style={{ height: 13, width: "45%" }} />
          </div>
        ))}
      </div>

      {/* ── Purchase card col ── */}
      <div className="pdp-grid__card">
        <div
          className="rounded-lg p-4"
          style={{
            border: "1px solid var(--border-color)",
            background: "var(--card-bg)",
          }}
        >
          <div className="sk mb-3" style={{ height: 22, width: "60%" }} />
          <div className="sk mb-2" style={{ height: 14, width: "80%" }} />
          <div className="sk mb-2" style={{ height: 14, width: "50%" }} />
          <div className="sk mb-4" style={{ height: 14, width: "65%" }} />
          <div className="sk mb-3" style={{ height: 44, borderRadius: 4 }} />
          <div className="sk" style={{ height: 44, borderRadius: 4 }} />
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;
