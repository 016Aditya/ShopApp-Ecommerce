import { formatCurrency } from "@/utils/currency";

const SHIPPING_THRESHOLD = 499;
const SHIPPING_COST      = 40;
const TAX_RATE           = 0.18;

const OrderSummary = ({
  items = [],
  cartTotal = 0,
  onPlaceOrder,
  onBackToCart,
  loading,
}) => {
  const subtotal = cartTotal;
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax      = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const grand    = subtotal + shipping + tax;

  return (
    <div className="order-summary">
      <h2 className="order-summary__title">Order Summary</h2>

      <div className="order-summary__rows">
        <div className="order-summary__row">
          <span>Items ({items.length})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="order-summary__row">
          <span>Shipping</span>
          <span className={shipping === 0 ? "order-summary__free" : ""}>
            {shipping === 0 ? "FREE" : formatCurrency(shipping)}
          </span>
        </div>
        <div className="order-summary__row">
          <span>Tax (18% GST)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="order-summary__divider" />

      <div className="order-summary__total">
        <span>Order Total</span>
        <span>{formatCurrency(grand)}</span>
      </div>

      {shipping === 0 && (
        <p className="order-summary__free-note">🎉 You qualify for FREE delivery!</p>
      )}

      {onPlaceOrder && (
        <>
          <button
            className="btn order-summary__btn order-summary__btn--place"
            onClick={onPlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order…" : "Place Order"}
          </button>
          <button
            className="btn order-summary__btn order-summary__btn--back"
            onClick={onBackToCart}
            disabled={loading}
          >
            ← Back to Cart
          </button>
        </>
      )}

      <p className="order-summary__secure">🔒 Secure checkout</p>
    </div>
  );
};

export default OrderSummary;
