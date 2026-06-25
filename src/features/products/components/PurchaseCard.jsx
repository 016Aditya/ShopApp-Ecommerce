import { formatCurrency } from "@/utils/currency";

/**
 * PurchaseCard now accepts `addingToCart` and `buyingNow` boolean props
 * to show inline button loading states instead of blocking the whole page.
 */
const PurchaseCard = ({
  product,
  onAddToCart,
  onBuyNow,
  addingToCart = false,
  buyingNow    = false,
}) => {
  const outOfStock = product.inStock === false;

  return (
    <div
      className="purchase-card rounded-lg p-4"
      style={{
        border: "1px solid var(--border-color)",
        background: "var(--card-bg)",
        position: "sticky",
        top: 80,
      }}
    >
      {/* Price */}
      <div className="mb-3">
        <span
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {formatCurrency(product.price)}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span
              className="ml-2 text-sm line-through"
              style={{ color: "var(--text-tertiary)" }}
            >
              {formatCurrency(product.originalPrice)}
            </span>
            <span className="ml-2 text-sm font-semibold text-green-500">
              {Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              )}% off
            </span>
          </>
        )}
      </div>

      {/* Delivery & stock */}
      <p className="mb-1 text-sm text-green-500 font-medium">✓ Free Delivery</p>
      {outOfStock ? (
        <p className="mb-3 text-sm font-semibold text-red-500">Out of Stock</p>
      ) : (
        <p className="mb-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          In Stock — ships within 2 days
        </p>
      )}

      {/* Buttons */}
      <button
        className="mb-2 w-full rounded py-2.5 text-sm font-bold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          background: outOfStock ? "var(--bg-tertiary)" : "var(--accent, #ff9f00)",
          color: outOfStock ? "var(--text-tertiary)" : undefined,
        }}
        onClick={onAddToCart}
        disabled={outOfStock || addingToCart || buyingNow}
        aria-label="Add to cart"
      >
        {addingToCart ? (
          <span className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate"
                  from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" />
              </path>
            </svg>
            Adding…
          </span>
        ) : outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
      </button>

      <button
        className="w-full rounded py-2.5 text-sm font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          background: outOfStock ? "var(--bg-tertiary)" : "#fb8c00",
          color: outOfStock ? "var(--text-tertiary)" : "#fff",
        }}
        onClick={onBuyNow}
        disabled={outOfStock || addingToCart || buyingNow}
        aria-label="Buy now"
      >
        {buyingNow ? (
          <span className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate"
                  from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" />
              </path>
            </svg>
            Processing…
          </span>
        ) : outOfStock ? "UNAVAILABLE" : "BUY NOW"}
      </button>
    </div>
  );
};

export default PurchaseCard;
