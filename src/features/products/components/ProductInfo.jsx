import { useRef } from "react";
import { formatCurrency } from "@/utils/currency";
import "../styles/ProductDetail.css";

/**
 * StarRating — CSS linear-gradient partial-fill technique.
 *
 * No SVG, no DOM IDs. Each star gets a precise fill %:
 *   - rating 4.3 → stars 1-4 = 100%, star 5 = 30%
 *   - star N fill = clamp(0, rating - (N-1), 1) * 100
 *
 * Glow colour and intensity scale with the rating:
 *   0–2  → no glow (poor)
 *   2–3  → faint amber glow
 *   3–4  → warm amber glow
 *   4–4.5 → bright gold glow
 *   4.5–5  → vivid gold + white-core glow ("excellent")
 */
const StarRating = ({ value, size = 22 }) => {
  const rating = Math.min(5, Math.max(0, value ?? 0));

  // Glow filter strength that scales with rating
  const glowColor = "#f59e0b";
  const glowFilter =
    rating >= 4.5
      ? `drop-shadow(0 0 5px ${glowColor}) drop-shadow(0 0 10px ${glowColor})`
      : rating >= 4
      ? `drop-shadow(0 0 4px ${glowColor})`
      : rating >= 3
      ? `drop-shadow(0 0 2px #fbbf24)`
      : "none";

  return (
    <span
      className="pdp-stars"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
      role="img"
      style={{
        "--star-size": `${size}px`,
        filter: glowFilter,
        transition: "filter 0.3s ease",
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        // How much of this star is filled (0 to 1)
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        const pct = Math.round(fill * 100);

        return (
          <span
            key={i}
            className="pdp-star-v2"
            aria-hidden="true"
            style={{
              // Single ★ character coloured by gradient:
              // 0..pct% = gold, pct..100% = grey
              background: `linear-gradient(90deg, #f59e0b ${pct}%, #c8c8c8 ${pct}%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: `${size}px`,
              lineHeight: 1,
              display: "inline-block",
              // Slight scale-up for high-rated stars
              transform: fill === 1 ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
};

const formatCount = (n, compact = false) => {
  if (!n || n === 0) return "0";
  if (compact && n >= 1000) {
    return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return n.toLocaleString("en-IN");
};

const ProductRating = ({ averageRating, reviewCount, onScrollToReviews }) => {
  const rating = averageRating ?? 0;
  const count  = reviewCount  ?? 0;

  return (
    <div className="pdp-rating">
      <StarRating value={rating} size={22} />

      <span className="pdp-rating__score">
        {rating > 0 ? rating.toFixed(1) : "0.0"}
      </span>

      <span className="pdp-rating__sep" aria-hidden="true">·</span>

      <button
        type="button"
        className="pdp-rating__count"
        onClick={onScrollToReviews}
        aria-label={`${count.toLocaleString("en-IN")} ratings — click to see reviews`}
      >
        <span className="pdp-rating__count--desktop">
          ({count > 0 ? formatCount(count) : "0"})
        </span>
        <span className="pdp-rating__count--mobile">
          {formatCount(count, true)} reviews
        </span>
      </button>
    </div>
  );
};

const ProductInfo = ({ product, reviewsSectionRef }) => {
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const scrollToReviews = () => {
    if (reviewsSectionRef?.current) {
      reviewsSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="pdp-info">
      <p className="pdp-info__category">
        {product.category}
        {product.subcategory && ` › ${product.subcategory}`}
      </p>

      <h1 className="pdp-info__name">{product.name}</h1>

      {product.brand ? (
        <p className="pdp-info__brand">
          by <span>{product.brand}</span>
        </p>
      ) : null}

      <hr className="pdp-info__divider" />

      <ProductRating
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
        onScrollToReviews={scrollToReviews}
      />

      <div className="pdp-info__price-row">
        <span className="pdp-info__price">{formatCurrency(product.price)}</span>
        {product.originalPrice && product.originalPrice > product.price ? (
          <span className="pdp-info__original-price">
            M.R.P: <s>{formatCurrency(product.originalPrice)}</s>
          </span>
        ) : null}
        {discount ? (
          <span className="pdp-info__discount">({discount}% off)</span>
        ) : null}
      </div>

      <p className="pdp-info__tax-note">Inclusive of all taxes</p>

      <hr className="pdp-info__divider" />

      {product.description ? (
        <div className="pdp-info__desc">
          <h3>About this item</h3>
          <p>{product.description}</p>
        </div>
      ) : null}

      {Array.isArray(product.features) && product.features.length > 0 ? (
        <div className="pdp-info__features">
          <h3>Key Features</h3>
          <ul>
            {product.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className={`pdp-info__stock ${product.inStock === false ? "pdp-info__stock--out" : ""}`}>
        {product.inStock === false ? "Currently unavailable" : "In Stock"}
      </p>
    </div>
  );
};

export default ProductInfo;
