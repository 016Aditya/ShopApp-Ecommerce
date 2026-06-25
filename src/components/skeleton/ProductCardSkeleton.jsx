import "./skeletons.css";

/**
 * Mirrors the standard ProductCard layout exactly:
 * - square image area (1:1 aspect-ratio with 7px margin)
 * - product name (2 lines)
 * - rating badge bar
 * - price
 * - free delivery text
 * - category badge
 * - ADD TO CART button
 */
const ProductCardSkeleton = ({ compact = false }) => {
  if (compact) {
    return (
      <div
        className="flex flex-col items-center rounded-sm border p-3"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
        aria-hidden="true"
      >
        {/* Image */}
        <div
          className="sk w-full rounded mb-2"
          style={{ aspectRatio: "1 / 1", borderRadius: 8 }}
        />
        {/* Name */}
        <div className="sk w-full mb-1" style={{ height: 13 }} />
        <div className="sk mb-1" style={{ height: 13, width: "70%" }} />
        {/* Rating */}
        <div className="sk mb-1" style={{ height: 18, width: "50%", borderRadius: 999 }} />
        {/* Price */}
        <div className="sk" style={{ height: 18, width: "40%" }} />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col rounded-sm border shadow-sm"
      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
      aria-hidden="true"
    >
      {/* Image area */}
      <div
        className="sk"
        style={{
          aspectRatio: "1 / 1",
          margin: 7,
          width: "calc(100% - 14px)",
          borderRadius: 8,
        }}
      />

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="sk" style={{ height: 13 }} />
        <div className="sk" style={{ height: 13, width: "80%" }} />
        {/* Rating */}
        <div className="sk" style={{ height: 18, width: "55%", borderRadius: 999, marginTop: 2 }} />
        {/* Price row */}
        <div className="flex items-center gap-2 mt-1">
          <div className="sk" style={{ height: 18, width: "40%" }} />
          <div className="sk" style={{ height: 12, width: "25%" }} />
        </div>
        {/* Free delivery */}
        <div className="sk" style={{ height: 11, width: "45%" }} />
        {/* Category badge */}
        <div className="sk" style={{ height: 20, width: "35%", borderRadius: 999 }} />
      </div>

      {/* Button */}
      <div className="px-3 pb-3">
        <div className="sk w-full" style={{ height: 34, borderRadius: 2 }} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
