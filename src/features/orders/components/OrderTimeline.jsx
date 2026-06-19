/**
 * OrderTimeline — unified timeline.
 *
 * Supports all statuses in a single horizontal bar:
 *   PENDING → CONFIRMED → PACKED → SHIPPED → DELIVERED
 *   → RETURN_REQUESTED → RETURNED
 *
 * When status is CANCELLED a compact cancellation notice is shown.
 * Return stages are appended to the same bar so the user sees one
 * continuous journey (matches the requirement: "do not create a
 * separate timeline").
 */

const BASE_STAGES = [
  { key: "PENDING",   label: "Order Placed", icon: "📋" },
  { key: "CONFIRMED", label: "Confirmed",    icon: "✅" },
  { key: "PACKED",    label: "Packed",       icon: "📦" },
  { key: "SHIPPED",   label: "Shipped",      icon: "🚚" },
  { key: "DELIVERED", label: "Delivered",    icon: "🎉" },
];

const RETURN_STAGES = [
  { key: "RETURN_REQUESTED", label: "Return Requested", icon: "🔄" },
  { key: "RETURNED",         label: "Returned",          icon: "↩️" },
];

// All statuses that indicate the return flow has started
const RETURN_STATUSES = new Set(["RETURN_REQUESTED", "RETURNED"]);

const OrderTimeline = ({ status }) => {
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

  // ── Determine which stage set to render ────────────────────────────
  const isReturnFlow = RETURN_STATUSES.has(upperStatus);

  // When we're in the return flow, show all base stages as done,
  // then append the return stages.
  const stages = isReturnFlow
    ? [...BASE_STAGES, ...RETURN_STAGES]
    : BASE_STAGES;

  const currentIdx = stages.findIndex((s) => s.key === upperStatus);
  // Fallback: if status not found, default to first stage
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="order-timeline">
      {stages.map((stage, idx) => {
        const done    = idx <= activeIdx;
        const current = idx === activeIdx;
        // Connector between return section and base section
        const isBridge = idx === BASE_STAGES.length - 1 && isReturnFlow;

        return (
          <div key={stage.key} className="order-timeline__step">
            {/* Dot */}
            <div
              className={
                "order-timeline__dot" +
                (done    ? " order-timeline__dot--done"    : "") +
                (current ? " order-timeline__dot--current" : "") +
                (RETURN_STATUSES.has(stage.key) ? " order-timeline__dot--return" : "")
              }
            >
              {done
                ? <span role="img" aria-hidden>{stage.icon}</span>
                : <span className="order-timeline__dot-empty" />}
            </div>

            {/* Label */}
            <span
              className={
                "order-timeline__label" +
                (current          ? " order-timeline__label--current" : "") +
                (done && !current ? " order-timeline__label--done"    : "") +
                (RETURN_STATUSES.has(stage.key) ? " order-timeline__label--return" : "")
              }
            >
              {stage.label}
            </span>

            {/* Connector line (not after last stage) */}
            {idx < stages.length - 1 && (
              <div
                className={
                  "order-timeline__line" +
                  (idx < activeIdx       ? " order-timeline__line--done"   : "") +
                  (isBridge              ? " order-timeline__line--bridge" : "")
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
