/**
 * OrderTimeline — Unified Horizontal Timeline
 *
 * Polish pass v3:
 * 1. gap: 14px on .order-timeline (flex container)
 * 2. Divider: 0.8rem / 500 / opacity 0.55 / letter-spacing 0.3px / margin 0 16px
 * 3. align-items: center so dot row, divider, and labels share one baseline
 * 4. Return connector: #f59e0b done, var(--border-color) future
 * 5. Active return dot: box-shadow 0 0 0 4px rgba(245,158,11,.15) + border rgba(245,158,11,.4)
 * 6. max-width 1200px wrapper, desktop overflow-visible, mobile overflow-x-auto
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
 * Inline divider between Delivered and Return Requested.
 * Vertically centred with the dot row via align-items: center on the flex parent.
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
      {/* gap-14 class applies gap:14px; align-items:center keeps everything on one row */}
      <div className="order-timeline order-timeline--gap14" role="list" aria-label="Order timeline">
        {stages.map((stage, idx) => {
          const isDone    = idx <= activeIdx;
          const isCurrent = idx === activeIdx;
          const isReturn  = stage.type === "return";
          const isTerminalReturn =
            (stage.key === "RETURN_SUCCESSFUL" || stage.key === "REFUND_PROCESSED") && isDone;

          // Dot classes
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

          // Label classes
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
          if (isReturn) labelClass += " order-timeline__label--return";

          // Connector classes
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
                {/* Dot */}
                <div className={dotClass} aria-hidden="true">
                  {isDone && (
                    <span className="order-timeline__dot-icon">{stage.icon}</span>
                  )}
                </div>
                {/* Label — sits below the dot inside the step column */}
                <span className={labelClass}>{stage.label}</span>
                {/* Connector to the next step */}
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
