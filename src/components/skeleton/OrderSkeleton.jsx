import "./skeletons.css";

/**
 * Mirrors an OrderCard: order meta row + product thumbnails row + status badge + total.
 */
const OrderCardSkeleton = () => (
  <div
    className="order-card rounded-lg p-4 mb-4"
    style={{
      border: "1px solid var(--border-color)",
      background: "var(--card-bg)",
    }}
    aria-hidden="true"
  >
    {/* Header: order id + date */}
    <div className="flex justify-between items-center mb-3">
      <div className="sk" style={{ height: 14, width: 140 }} />
      <div className="sk" style={{ height: 24, width: 80, borderRadius: 999 }} />
    </div>

    {/* Product thumbnails */}
    <div className="flex gap-2 mb-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="sk" style={{ width: 56, height: 56, borderRadius: 6 }} />
      ))}
    </div>

    {/* Price + action row */}
    <div className="flex justify-between items-center">
      <div className="sk" style={{ height: 16, width: 90 }} />
      <div className="sk" style={{ height: 32, width: 100, borderRadius: 4 }} />
    </div>
  </div>
);

/**
 * Full orders page skeleton: title + N order cards.
 */
const OrderSkeleton = ({ count = 4 }) => (
  <div className="orders-page" aria-hidden="true">
    <div className="sk mb-4" style={{ height: 24, width: 130 }} />
    <div className="sk mb-6" style={{ height: 14, width: 80 }} />
    {Array.from({ length: count }).map((_, i) => (
      <OrderCardSkeleton key={i} />
    ))}
  </div>
);

export { OrderCardSkeleton };
export default OrderSkeleton;
