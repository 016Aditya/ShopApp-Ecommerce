import { formatCurrency } from "@/utils/currency";
import "../styles/ProductDetail.css";

/**
 * ProductInfo — center column.
 * Shows brand, name, rating, price, description, features.
 */
const StarRating = ({ value }) => {
  const full  = Math.floor(value);
  const half  = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="pdp-stars" aria-label={`${value} out of 5 stars`}>
      {Array(full).fill("★").join("")}
      {half ? "⯨" : ""}
      {Array(empty).fill("☆").join("")}
    </span>
  );
};

const ProductInfo = ({ product }) => {
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

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

      {/* Rating row */}
      <div className="pdp-info__rating-row">
        <StarRating value={product.averageRating ?? 0} />
        <span className="pdp-info__review-count">
          {product.reviewCount ?? 0} ratings
        </span>
      </div>

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
