/**
 * OrderTimeline — Unified Horizontal Timeline
 *
 * Polish pass v4:
 * - "Delivery Completed | Return Process" label is now rendered ABOVE
 *   the timeline nodes, not between them.
 * - Timeline itself remains a single, unbroken flex row of nodes.
 * - align-items: center on the flex container so every node shares the
 *   same vertical midpoint.
 * - gap: 14px on the timeline flex row.
 */

const DELIVERY_STAGES = [
  { key: "PENDING",   label: "Order Placed", icon: "📋", type: "delivery" },
  { key: "CONFIRMED", label: "Confirmed",    icon: "✓",  type: "delivery" },
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
      {/*
        Section label — sits ABOVE the timeline.
        Only visible when in the return flow.
        Centered, dimmed, small — purely decorative context.
      */}
      {isReturnFlow && (
        <p className="order-timeline__section-label" aria-hidden="true">
          Delivery Completed&nbsp;│&nbsp;Return Process
        </p>
      )}

      {/* Single unified timeline row */}
      <div
        className="order-timeline order-timeline--gap14"
        role="list"
        aria-label="Order timeline"
      >
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

          return (
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
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
