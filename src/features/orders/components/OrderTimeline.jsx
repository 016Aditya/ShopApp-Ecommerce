/**
 * OrderTimeline — Unified Horizontal Timeline
 *
 * Polish pass (spec v2):
 * 1. Desktop: no scrollbar — overflow-visible; mobile/tablet: overflow-x-auto
 * 2. Divider simplified: “Delivery Completed | Return Process”, subtle, 0.85rem
 * 3. Gap between Delivered → divider → Return Requested reduced to ~20px
 * 4. Return labels: 12px, line-height 1.2, max-width 80px
 * 5. Active return step: box-shadow 0 0 0 4px rgba(245,158,11,.18) + scale(1.05)
 * 6. Connector colors: delivery done → #22c55e, return done → #f59e0b
 * 7. max-width 1200px, margin 0 auto
 */

const DELIVERY_STAGES = [
  { key: "PENDING",   label: "Order Placed", icon: "📋", type: "delivery" },
  { key: "CONFIRMED", label: "Confirmed",    icon: "✓",    type: "delivery" },
  { key: "PACKED",    label: "Packed",       icon: "📦",   type: "delivery" },
  { key: "SHIPPED",   label: "Shipped",      icon: "🚚",   type: "delivery" },
  { key: "DELIVERED", label: "Delivered",    icon: "🎉",   type: "delivery" },
];

const RETURN_STAGES = [
  { key: "RETURN_REQUESTED",  label: "Return Requested",  icon: "↩",  type: "return" },
  { key: "RETURN_APPROVED",   label: "Return Approved",   icon: "✓",  type: "return" },
  { key: "PICKUP_SCHEDULED",  label: "Pickup Scheduled",  icon: "📅", type: "return" },
  { key: "PICKED_UP",         label: "Picked Up",         icon: "📦", type: "return" },
  { key: "REFUND_PROCESSED",  label: "Refund Processed",  icon: "💸", type: "return" },
  { key: "RETURN_SUCCESSFUL", label: "Return Successful", icon: "✓",  type: "return" },
];

/**
 * Slim inline divider between delivery end and return start.
 * Not a step — aria-hidden, never affects activeIdx.
 */
const ReturnFlowDivider = () => (
  <div className="order-timeline__return-divider" aria-hidden="true">
    <span className="order-timeline__return-divider-text">
      Delivery Completed&nbsp;│&nbsp;Return Process
    </span>
  </div>
);

const OrderTimeline = ({ status, isReturnFlow }) => {
  const upperStatus = (status ?? "PENDING").toUpperCase();

  if (upperStatus === "CANCELLED") {
    return (
      <div className="order-timeline order-timeline--cancelled">
        <span className="order-timeline__cancelled-icon">❌</span>
        <span>Order Cancelled</span>
      </div>
    );
  }

  const stages     = isReturnFlow ? [...DELIVERY_STAGES, ...RETURN_STAGES] : DELIVERY_STAGES;
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

          // Dot modifier
          let dotClass = "order-timeline__dot";
          if (isDone) {
            dotClass += isTerminalReturn
              ? " order-timeline__dot--success"
              : isReturn
              ? " order-timeline__dot--return-done"
              : " order-timeline__dot--done";
          }
          if (isCurrent) {
            dotClass += isTerminalReturn
              ? " order-timeline__dot--success-current"
              : isReturn
              ? " order-timeline__dot--return-current"
              : " order-timeline__dot--current";
          }

          // Label modifier
          let labelClass = "order-timeline__label";
          if (isDone) {
            labelClass += isTerminalReturn
              ? " order-timeline__label--success"
              : isReturn
              ? " order-timeline__label--return-done"
              : " order-timeline__label--done";
          }
          if (isCurrent) {
            labelClass += isTerminalReturn
              ? " order-timeline__label--success-current"
              : isReturn
              ? " order-timeline__label--return-current"
              : " order-timeline__label--current";
          }
          // Compact font for return labels
          if (isReturn) labelClass += " order-timeline__label--return";

          // Connector line
          let lineClass = "order-timeline__line";
          if (idx < activeIdx) {
            lineClass += isReturn
              ? " order-timeline__line--return"
              : " order-timeline__line--done";
          }

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
