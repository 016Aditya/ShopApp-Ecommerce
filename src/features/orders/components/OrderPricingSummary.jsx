// src/features/orders/components/OrderPricingSummary.jsx
//
// Pricing summary card used in OrderDetailPage.
// Reads real order data (order.totalPrice, order.items) — NOT the cart.
// Uses the same tax/shipping constants as CheckoutPage so numbers are consistent.

import { formatCurrency } from "@/utils/currency";

const SHIPPING_THRESHOLD = 499;
const SHIPPING_COST      = 40;
const TAX_RATE           = 0.18;

/**
 * Derives pricing breakdown from the order object.
 *
 * The backend stores totalPrice as the GRAND total (items + tax + shipping).
 * We reverse-compute subtotal from items to show individual line rows.
 */
const OrderPricingSummary = ({ order }) => {
  if (!order) return null;

  const items = order.items ?? [];

  // Compute item-level subtotal from snapshots
  const subtotal = items.reduce((sum, item) => {
    const lineTotal = (item.price ?? item.unitPrice ?? 0) * (item.quantity ?? 1);
    return sum + lineTotal;
  }, 0);

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax      = parseFloat((subtotal * TAX_RATE).toFixed(2));

  // Prefer server total; fall back to computed if missing
  const grandTotal =
    order.totalPrice && order.totalPrice > subtotal
      ? order.totalPrice
      : parseFloat((subtotal + shipping + tax).toFixed(2));

  const itemCount = items.reduce((n, i) => n + (i.quantity ?? 1), 0);

  return (
    <div className="order-pricing-summary">
      <h3 className="order-pricing-summary__title">Order Summary</h3>

      <div className="order-pricing-summary__rows">
        <div className="order-pricing-summary__row">
          <span>Items ({itemCount})</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="order-pricing-summary__row">
          <span>Shipping</span>
          <span
            className={
              shipping === 0
                ? "order-pricing-summary__value--free"
                : ""
            }
          >
            {shipping === 0 ? "FREE" : formatCurrency(shipping)}
          </span>
        </div>

        <div className="order-pricing-summary__row">
          <span>Tax (18% GST)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>

      <div className="order-pricing-summary__divider" />

      <div className="order-pricing-summary__total">
        <span>Order Total</span>
        <span className="order-pricing-summary__total-value">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      {shipping === 0 && (
        <p className="order-pricing-summary__free-note">
          🎉 You qualify for FREE delivery!
        </p>
      )}

      <p className="order-pricing-summary__secure">🔒 Secure checkout</p>
    </div>
  );
};

export default OrderPricingSummary;
