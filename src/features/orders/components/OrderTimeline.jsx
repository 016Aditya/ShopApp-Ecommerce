/**
 * OrderTimeline — Unified Horizontal Timeline
 *
 * Changes (polish only — no logic change):
 * 1. Timeline wrapper capped at max-width 1000px, centred.
 * 2. "↩ Returns" divider node injected between DELIVERED and RETURN_REQUESTED.
 *    The divider is purely decorative — it is not a stage, has no dot, and
 *    never affects activeIdx calculation.
 * 3. Dot size reduced to 32px for tighter feel on large screens.
 */

const DELIVERY_STAGES = [
  { key: "PENDING",   label: "Order Placed", icon: "📋", type: "delivery" },
  { key: "CONFIRMED", label: "Confirmed",    icon: "✅", type: "delivery" },
  { key: "PACKED",    label: "Packed",       icon: "📦", type: "delivery" },
  { key: "SHIPPED",   label: "Shipped",      icon: "🚚", type: "delivery" },
  { key: "DELIVERED", label: "Delivered",    icon: "🎉", type: "delivery" },
];

const RETURN_STAGES = [
  { key: "RETURN_REQUESTED",  label: "Return Requested",  icon: "↩",  type: "return" },
  { key: "RETURN_APPROVED",   label: "Return Approved",   icon: "✓",  type: "return" },
  { key: "PICKUP_SCHEDULED",  label: "Pickup Scheduled",  icon: "📅", type: "return" },
  { key: "PICKED_UP",         label: "Picked Up",         icon: "📦", type: "return" },
  { key: "REFUND_PROCESSED",  label: "Refund Processed",  icon: "💸", type: "return" },
  { key: "RETURN_SUCCESSFUL", label: "Return Successful", icon: "✓",  type: "return" },
];

const RETURN_FLOW_STATUSES = new Set([
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "REFUND_PROCESSED",
  "RETURN_SUCCESSFUL",
]);

/** Thin horizontal divider injected between delivery and return segments */
const ReturnFlowDivider = () => (
  <div className="order-timeline__return-divider" aria-hidden="true">
    <span className="order-timeline__return-divider-line" />
    <span className="order-timeline__return-divider-label">↩ Returns</span>
    <span className="order-timeline__return-divider-line" />
  </div>
);

const OrderTimeline = ({ status, isReturnFlow }) => {
  const upperStatus = (status ?? "PENDING").toUpperCase();

  // ── Cancelled ────────────────────────────────────────────────────
  if (upperStatus === "CANCELLED") {
    return (
      <div className="order-timeline order-timeline--cancelled">
        <span className="order-timeline__cancelled-icon">❌</span>
        <span>Order Cancelled</span>
      </div>
    );
  }

  const stages    = isReturnFlow ? [...DELIVERY_STAGES, ...RETURN_STAGES] : DELIVERY_STAGES;
  const currentIdx = stages.findIndex((s) => s.key === upperStatus);
  const activeIdx  = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="order-timeline-wrapper">
      <div className="order-timeline" role="list" aria-label="Order timeline">
        {stages.map((stage, idx) => {
          const isDone    = idx <= activeIdx;
          const isCurrent = idx === activeIdx;
          const isReturn  = stage.type === "return";
          const isTerminalReturn =
            (stage.key === "RETURN_SUCCESSFUL" || stage.key === "REFUND_PROCESSED") && isDone;

          let dotClass   = "order-timeline__dot";
          let labelClass = "order-timeline__label";

          if (isDone) {
            if (isTerminalReturn) {
              dotClass   += " order-timeline__dot--success";
              labelClass += " order-timeline__label--success";
            } else if (isReturn) {
              dotClass   += " order-timeline__dot--return-done";
              labelClass += " order-timeline__label--return-done";
            } else {
              dotClass   += " order-timeline__dot--done";
              labelClass += " order-timeline__label--done";
            }
          }

          if (isCurrent) {
            if (isTerminalReturn) {
              dotClass   += " order-timeline__dot--success-current";
              labelClass += " order-timeline__label--success-current";
            } else if (isReturn) {
              dotClass   += " order-timeline__dot--return-current";
              labelClass += " order-timeline__label--return-current";
            } else {
              dotClass   += " order-timeline__dot--current";
              labelClass += " order-timeline__label--current";
            }
          }

          let lineClass = "order-timeline__line";
          if (idx < activeIdx) {
            lineClass += isReturn
              ? " order-timeline__line--return"
              : " order-timeline__line--done";
          }

          // Inject the divider between the last delivery stage and first return stage
          const isFirstReturn = isReturn && idx === DELIVERY_STAGES.length;

          return (
            <>
              {isFirstReturn && <ReturnFlowDivider key="return-divider" />}
              <div key={stage.key} className="order-timeline__step" role="listitem">
                <div className={dotClass} aria-hidden="true">
                  {isDone && (
                    <span className="order-timeline__dot-icon">{stage.icon}</span>
                  )}
                </div>
                <span className={labelClass}>{stage.label}</span>
                {idx < stages.length - 1 && (
                  <div className={lineClass} aria-hidden="true" />
                )}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
