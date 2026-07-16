import { formatCurrencyTrimmed } from "@/utils/currency";

const SpinnerLabel = ({ label }) => (
  <span className="flex items-center justify-center gap-2">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.7s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
    {label}
  </span>
);

const PurchaseCard = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  onBuyNow,
  addingToCart = false,
  removingFromCart = false,
  buyingNow = false,
  isInCart = false,
}) => {
  const outOfStock = product.inStock === false;
  const cartBtnDisabled = outOfStock || addingToCart || removingFromCart || buyingNow;

  const cartBtnStyle = () => {
    if (outOfStock) return { background: "var(--bg-tertiary)", color: "var(--text-tertiary)" };
    if (addingToCart) return { background: "#86efac", color: "#fff" };
    if (removingFromCart) return { background: "#fca5a5", color: "#fff" };
    if (isInCart) return { background: "#ef4444", color: "#fff" };
    return { background: "var(--accent, #ff9f00)", color: "#fff" };
  };

  const cartBtnLabel = () => {
    if (outOfStock) return "OUT OF STOCK";
    if (addingToCart) return <SpinnerLabel label="Adding..." />;
    if (removingFromCart) return <SpinnerLabel label="Removing..." />;
    if (isInCart) return "REMOVE FROM CART";
    return "ADD TO CART";
  };

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
      <div className="mb-3">
        <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          {formatCurrencyTrimmed(Number(product.price))}
        </span>

        {product.originalPrice > product.price && (
          <>
            <span className="ml-2 text-sm line-through" style={{ color: "var(--text-tertiary)" }}>
              {formatCurrencyTrimmed(product.originalPrice)}
            </span>
            <span className="ml-2 text-sm font-semibold text-green-500">
              {Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              )}% off
            </span>
          </>
        )}
      </div>

      <p className="mb-1 text-sm text-green-500 font-medium">Free Delivery</p>
      {outOfStock ? (
        <p className="mb-3 text-sm font-semibold text-red-500">Out of Stock</p>
      ) : (
        <p className="mb-3 text-sm" style={{ color: "var(--text-secondary)" }}>
          In Stock - ships within 2 days
        </p>
      )}

      <button
        className="mb-2 w-full rounded py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
        style={{
          ...cartBtnStyle(),
          transition: "background 250ms ease, color 250ms ease",
        }}
        onClick={isInCart ? onRemoveFromCart : onAddToCart}
        disabled={cartBtnDisabled}
        aria-label={isInCart ? "Remove from cart" : "Add to cart"}
      >
        {cartBtnLabel()}
      </button>

      <button
        className="w-full rounded py-2.5 text-sm font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          background: outOfStock ? "var(--bg-tertiary)" : "#fb8c00",
          color: outOfStock ? "var(--text-tertiary)" : "#fff",
        }}
        onClick={onBuyNow}
        disabled={outOfStock || addingToCart || removingFromCart || buyingNow}
        aria-label="Buy now"
      >
        {buyingNow ? (
          <SpinnerLabel label="Processing..." />
        ) : outOfStock ? "UNAVAILABLE" : "BUY NOW"}
      </button>

      <div
        className="mt-3 flex items-center gap-2 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        <span aria-hidden="true">Secure</span>
        <span>Secure checkout</span>
      </div>
    </div>
  );
};

export default PurchaseCard;
