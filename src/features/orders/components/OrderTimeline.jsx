/**
 * OrderTimeline — Unified Horizontal Timeline
 *
 * ✅ REQUIREMENTS MET:
 * - Single unified timeline (no separate return box)
 * - Horizontal layout with scrolling on mobile
 * - Delivery stages: PENDING → CONFIRMED → PACKED → SHIPPED → DELIVERED
 * - Return stages (when applicable): RETURN_REQUESTED → RETURN_APPROVED → PICKUP_SCHEDULED
 *   → PICKED_UP → REFUND_PROCESSED → RETURN_SUCCESSFUL
 * - Color-coded:
 *   • Completed delivery: Green (#22c55e)
 *   • Current/active step: Amber (#f59e0b)
 *   • Completed return: Amber
 *   • Future steps: var(--text-secondary)
 *   • Cancelled: Red (#ef4444)
 * - Dark mode compliant: uses CSS variables, no white backgrounds
 * - Conditional rendering: return stages only shown if order entered return flow
 */

const DELIVERY_STAGES = [
  { key: "PENDING",   label: "Order Placed", icon: "📋", type: "delivery" },
  { key: "CONFIRMED", label: "Confirmed",    icon: "✅", type: "delivery" },
  { key: "PACKED",    label: "Packed",       icon: "📦", type: "delivery" },
  { key: "SHIPPED",   label: "Shipped",      icon: "🚚", type: "delivery" },
  { key: "DELIVERED", label: "Delivered",    icon: "🎉", type: "delivery" },
];

const RETURN_STAGES = [
  { key: "RETURN_REQUESTED",  label: "Return Requested",  icon: "↩", type: "return" },
  { key: "RETURN_APPROVED",   label: "Return Approved",   icon: "✓", type: "return" },
  { key: "PICKUP_SCHEDULED",  label: "Pickup Scheduled",  icon: "📅", type: "return" },
  { key: "PICKED_UP",         label: "Picked Up",         icon: "📦", type: "return" },
  { key: "REFUND_PROCESSED",  label: "Refund Processed",  icon: "💸", type: "return" },
  { key: "RETURN_SUCCESSFUL", label: "Return Successful", icon: "✓", type: "return" },
];

// All statuses that indicate the return flow has started
const RETURN_FLOW_STATUSES = new Set([
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "REFUND_PROCESSED",
  "RETURN_SUCCESSFUL",
]);

const OrderTimeline = ({ status, isReturnFlow }) => {
  const upperStatus = (status ?? "PENDING").toUpperCase();

  // ── Cancelled state ────────────────────────────────────────────────
  if (upperStatus === "CANCELLED") {
    return (
      <div className="order-timeline order-timeline--cancelled">
        <span className="order-timeline__cancelled-icon">❌</span>
        <span>Order Cancelled</span>
      </div>
    );
  }

  // ── Determine stages to render ───────────────────────────────────
  // If order has entered return flow, append return stages to delivery stages
  const stages = isReturnFlow
    ? [...DELIVERY_STAGES, ...RETURN_STAGES]
    : DELIVERY_STAGES;

  const currentIdx = stages.findIndex((s) => s.key === upperStatus);
  // Fallback: if status not found, default to first stage
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="order-timeline" role="list" aria-label="Order timeline">
      {stages.map((stage, idx) => {
        const isDone    = idx <= activeIdx;
        const isCurrent = idx === activeIdx;
        const isReturn  = stage.type === "return";
        const isTerminalReturn = stage.key === "RETURN_SUCCESSFUL" && isDone;

        // Color logic:
        // - Completed delivery steps: green
        // - Current/active step: amber
        // - Completed return steps: amber (or green if terminal success)
        // - Future steps: secondary text color
        let dotClass = "order-timeline__dot";
        let labelClass = "order-timeline__label";

        if (isDone) {
          if (isReturn && isTerminalReturn) {
            dotClass += " order-timeline__dot--success";
            labelClass += " order-timeline__label--success";
          } else if (isReturn) {
            dotClass += " order-timeline__dot--return-done";
            labelClass += " order-timeline__label--return-done";
          } else {
            dotClass += " order-timeline__dot--done";
            labelClass += " order-timeline__label--done";
          }
        }

        if (isCurrent) {
          if (isReturn && isTerminalReturn) {
            dotClass += " order-timeline__dot--success-current";
            labelClass += " order-timeline__label--success-current";
          } else if (isReturn) {
            dotClass += " order-timeline__dot--return-current";
            labelClass += " order-timeline__label--return-current";
          } else {
            dotClass += " order-timeline__dot--current";
            labelClass += " order-timeline__label--current";
          }
        }

        // Connector line color
        let lineClass = "order-timeline__line";
        if (idx < activeIdx) {
          if (isReturn) {
            lineClass += " order-timeline__line--return";
          } else {
            lineClass += " order-timeline__line--done";
          }
        }

        return (
          <div key={stage.key} className="order-timeline__step" role="listitem">
            {/* Dot */}
            <div className={dotClass} aria-hidden="true">
              {isDone && (
                <span className="order-timeline__dot-icon">
                  {stage.icon}
                </span>
              )}
            </div>

            {/* Label */}
            <span className={labelClass}>
              {stage.label}
            </span>

            {/* Connector line (not after last stage) */}
            {idx < stages.length - 1 && (
              <div className={lineClass} aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
