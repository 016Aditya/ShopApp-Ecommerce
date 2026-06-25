import { useRef } from "react";
import { formatCurrency } from "@/utils/currency";
import "../styles/ProductDetail.css";

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
          <span className="pdp-star__bg">★</span>
          <span className="pdp-star__fg" style={{ clipPath: `url(#${id}-clip-${i})` }}>★</span>
        </span>
      ))}
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
      <StarRating value={rating} size={15} />
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

      {/* Price row — use ternary (not &&) to avoid rendering 0 */}
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
