import "./skeletons.css";

/**
 * Mirrors CartItem layout: thumbnail | details | qty controls | price | remove.
 */
const CartItemSkeleton = () => (
  <div
    className="flex gap-4 py-5"
    style={{ borderBottom: "1px solid var(--border-color)" }}
    aria-hidden="true"
  >
    {/* Thumbnail */}
    <div className="sk flex-shrink-0" style={{ width: 80, height: 80, borderRadius: 6 }} />

    <div className="flex flex-1 flex-col gap-2">
      {/* Brand badge + category */}
      <div className="flex gap-2">
        <div className="sk" style={{ height: 18, width: 60, borderRadius: 999 }} />
        <div className="sk" style={{ height: 18, width: 70, borderRadius: 999 }} />
      </div>
      {/* Product name */}
      <div className="sk" style={{ height: 14 }} />
      <div className="sk" style={{ height: 14, width: "70%" }} />
      {/* Qty + remove row */}
      <div className="flex items-center gap-3 mt-1">
        <div className="sk" style={{ height: 30, width: 90, borderRadius: 4 }} />
        <div className="sk" style={{ height: 13, width: 50 }} />
      </div>
    </div>

    {/* Price column */}
    <div className="flex-shrink-0 flex flex-col items-end gap-1">
      <div className="sk" style={{ height: 18, width: 70 }} />
      <div className="sk" style={{ height: 12, width: 50 }} />
    </div>
  </div>
);

/**
 * Order summary panel skeleton.
 */
export const OrderSummarySkeleton = () => (
  <div
    className="rounded-lg p-5"
    style={{
      border: "1px solid var(--border-color)",
      background: "var(--card-bg)",
    }}
    aria-hidden="true"
  >
    <div className="sk mb-4" style={{ height: 20, width: "50%" }} />
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex justify-between mb-3">
        <div className="sk" style={{ height: 14, width: "40%" }} />
        <div className="sk" style={{ height: 14, width: "25%" }} />
      </div>
    ))}
    <div className="sk mt-2" style={{ height: 1 }} />
    <div className="flex justify-between mt-3 mb-5">
      <div className="sk" style={{ height: 18, width: "35%" }} />
      <div className="sk" style={{ height: 18, width: "30%" }} />
    </div>
    <div className="sk" style={{ height: 44, borderRadius: 4 }} />
  </div>
);

export default CartItemSkeleton;
