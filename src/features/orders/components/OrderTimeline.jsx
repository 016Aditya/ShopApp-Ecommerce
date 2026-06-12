const STAGES = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"];

const STAGE_LABELS = {
  PENDING:   "Order Placed",
  CONFIRMED: "Confirmed",
  PACKED:    "Packed",
  SHIPPED:   "Shipped",
  DELIVERED: "Delivered",
};

const STAGE_ICONS = {
  PENDING:   "📋",
  CONFIRMED: "✅",
  PACKED:    "📦",
  SHIPPED:   "🚚",
  DELIVERED: "🎉",
};

const OrderTimeline = ({ status }) => {
  if (status === "CANCELLED") {
    return (
      <div className="order-timeline order-timeline--cancelled">
        <span className="order-timeline__cancelled-icon">❌</span>
        <span>Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = STAGES.indexOf(status?.toUpperCase() ?? "PENDING");

  return (
    <div className="order-timeline">
      {STAGES.map((stage, idx) => {
        const done    = idx <= currentIdx;
        const current = idx === currentIdx;
        return (
          <div key={stage} className="order-timeline__step">
            <div
              className={
                `order-timeline__dot` +
                (done    ? " order-timeline__dot--done"    : "") +
                (current ? " order-timeline__dot--current" : "")
              }
            >
              {done
                ? STAGE_ICONS[stage]
                : <span className="order-timeline__dot-empty" />}
            </div>
            <span
              className={
                `order-timeline__label` +
                (current          ? " order-timeline__label--current" : "") +
                (done && !current ? " order-timeline__label--done"    : "")
              }
            >
              {STAGE_LABELS[stage]}
            </span>
            {idx < STAGES.length - 1 && (
              <div
                className={
                  `order-timeline__line` +
                  (idx < currentIdx ? " order-timeline__line--done" : "")
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
