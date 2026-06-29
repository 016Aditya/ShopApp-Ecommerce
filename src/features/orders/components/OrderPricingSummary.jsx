// src/features/orders/components/OrderPricingSummary.jsx

import { formatCurrency } from "@/utils/currency";

const SHIPPING_THRESHOLD = 499;
const SHIPPING_COST      = 40;
const TAX_RATE           = 0.18;

const OrderPricingSummary = ({ order }) => {
  if (!order) return null;

  const items = order.items ?? [];

  const subtotal = items.reduce((sum, item) => {
    const lineTotal = (item.price ?? item.unitPrice ?? 0) * (item.quantity ?? 1);
    return sum + lineTotal;
  }, 0);

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax      = parseFloat((subtotal * TAX_RATE).toFixed(2));

  const grandTotal =
    order.totalPrice && order.totalPrice > subtotal
      ? order.totalPrice
      : parseFloat((subtotal + shipping + tax).toFixed(2));

  const itemCount = items.reduce((n, i) => n + (i.quantity ?? 1), 0);

  return (
    <div className="ops">

      {/* ── Order Summary card ── */}
      <div className="ops__summary-card">
        <p className="ops__summary-title">Order Summary</p>

        <div className="ops__rows">
          <div className="ops__row">
            <span className="ops__label">Items ({itemCount})</span>
            <span className="ops__value">{formatCurrency(subtotal)}</span>
          </div>
          <div className="ops__row">
            <span className="ops__label">Shipping</span>
            <span className={`ops__value${shipping === 0 ? " ops__value--free" : ""}`}>
              {shipping === 0 ? "FREE" : formatCurrency(shipping)}
            </span>
          </div>
          <div className="ops__row">
            <span className="ops__label">Tax (18% GST)</span>
            <span className="ops__value">{formatCurrency(tax)}</span>
          </div>
        </div>

        <div className="ops__divider" />

        <div className="ops__total-row">
          <span className="ops__total-label">Order Total</span>
          <span className="ops__total-value">{formatCurrency(grandTotal)}</span>
        </div>

        {shipping === 0 && (
          <p className="ops__free-note">🎉 You qualify for FREE delivery!</p>
        )}
      </div>

      {/* ── Secure checkout card ── */}
      <div className="ops__secure-card">
        <span className="ops__secure-icon">🔒</span>
        <div>
          <p className="ops__secure-title">Secure checkout</p>
          <p className="ops__secure-sub">Your payment information is safe with us.</p>
        </div>
      </div>

    </div>
  );
};

export default OrderPricingSummary;
