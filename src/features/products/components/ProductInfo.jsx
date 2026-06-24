import { useRef } from "react";
import { formatCurrency } from "@/utils/currency";
import "../styles/ProductDetail.css";

/**
 * StarRating — SVG-based partial-fill stars.
 * Renders 5 stars where each star fills proportionally.
 * value: 0–5 (supports decimals like 4.3)
 */
const StarRating = ({ value, size = 15 }) => {
  const clampedValue = Math.min(5, Math.max(0, value ?? 0));
  const id = useRef(`sr-${Math.random().toString(36).slice(2)}`).current;

  return (
    <span
      className="pdp-stars"
      aria-label={`${clampedValue.toFixed(1)} out of 5 stars`}
      role="img"
      style={{ "--star-size": `${size}px` }}
    >
      {/* Hidden SVG defs for clipPaths */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          {[1, 2, 3, 4, 5].map((i) => {
            const fill = Math.min(1, Math.max(0, clampedValue - (i - 1)));
            return (
              <clipPath key={i} id={`${id}-clip-${i}`}>
                <rect x="0" y="0" width={`${fill * 100}%`} height="100%" />
              </clipPath>
            );
          })}
        </defs>
      </svg>

      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="pdp-star" aria-hidden="true">
          {/* Grey background star */}
          <span className="pdp-star__bg">★</span>
          {/* Orange foreground star clipped to fill % */}
          <span
            className="pdp-star__fg"
            style={{ clipPath: `url(#${id}-clip-${i})` }}
          >
            ★
          </span>
        </span>
      ))}
    </span>
  );
};

/**
 * Formats review count:
 *  - Desktop: 1,234 (comma separated)
 *  - Controlled by prop `compact`
 *  - compact: 99866 → "99.8k"
 */
const formatCount = (n, compact = false) => {
  if (!n || n === 0) return "0";
  if (compact && n >= 1000) {
    return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return n.toLocaleString("en-IN");
};

/**
 * ProductRating — the full rating row shown in ProductInfo.
 * Shows: ★★★★☆  4.5  (99,866)
 * On mobile: ★★★★☆  4.5 · 99.8k reviews
 */
const ProductRating = ({ averageRating, reviewCount, onScrollToReviews }) => {
  const rating = averageRating ?? 0;
  const count  = reviewCount  ?? 0;

  return (
    <div className="pdp-rating">
      {/* Stars */}
      <StarRating value={rating} size={15} />

      {/* Numeric score */}
      <span className="pdp-rating__score">
        {rating > 0 ? rating.toFixed(1) : "0.0"}
      </span>

      {/* Separator — visible on mobile only */}
      <span className="pdp-rating__sep" aria-hidden="true">·</span>

      {/* Review count — clickable, scrolls to reviews */}
      <button
        type="button"
        className="pdp-rating__count"
        onClick={onScrollToReviews}
        aria-label={`${count.toLocaleString("en-IN")} ratings — click to see reviews`}
      >
        {/* Desktop: (99,866) */}
        <span className="pdp-rating__count--desktop">
          ({count > 0 ? formatCount(count) : "0"})
        </span>
        {/* Mobile: 99.8k reviews */}
        <span className="pdp-rating__count--mobile">
          {formatCount(count, true)} reviews
        </span>
      </button>
    </div>
  );
};

const ProductInfo = ({ product, reviewsSectionRef }) => {
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const scrollToReviews = () => {
    if (reviewsSectionRef?.current) {
      reviewsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="pdp-info">
      {/* Category + subcategory */}
      <p className="pdp-info__category">
        {product.category}
        {product.subcategory && ` › ${product.subcategory}`}
      </p>

      {/* Name */}
      <h1 className="pdp-info__name">{product.name}</h1>

      {/* Brand */}
      {product.brand && (
        <p className="pdp-info__brand">
          by <span>{product.brand}</span>
        </p>
      )}

      {/* Divider */}
      <hr className="pdp-info__divider" />

      {/* ── Rating row ── */}
      <ProductRating
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
        onScrollToReviews={scrollToReviews}
      />

      {/* Price row */}
      <div className="pdp-info__price-row">
        <span className="pdp-info__price">{formatCurrency(product.price)}</span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="pdp-info__original-price">
            M.R.P: <s>{formatCurrency(product.originalPrice)}</s>
          </span>
        )}
        {discount && (
          <span className="pdp-info__discount">({discount}% off)</span>
        )}
      </div>

      {/* Inclusive text */}
      <p className="pdp-info__tax-note">Inclusive of all taxes</p>

      <hr className="pdp-info__divider" />

      {/* Description */}
      {product.description && (
        <div className="pdp-info__desc">
          <h3>About this item</h3>
          <p>{product.description}</p>
        </div>
      )}

      {/* Features list */}
      {Array.isArray(product.features) && product.features.length > 0 && (
        <div className="pdp-info__features">
          <h3>Key Features</h3>
          <ul>
            {product.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Stock */}
      <p className={`pdp-info__stock ${product.inStock === false ? "pdp-info__stock--out" : ""}`}>
        {product.inStock === false ? "Currently unavailable" : "In Stock"}
      </p>
    </div>
  );
};

export default ProductInfo;
