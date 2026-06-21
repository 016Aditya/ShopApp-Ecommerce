/**
 * ReturnTimeline
 *
 * FIX: Stage keys now exactly match backend OrderStatus enum:
 *   RETURN_REQUESTED → RETURN_APPROVED → PICKUP_SCHEDULED
 *   → PICKED_UP → REFUND_PROCESSED → RETURN_SUCCESSFUL
 *
 * Previous keys RETURN_CONFIRMED and ITEM_PICKED_UP did not exist on
 * the backend, causing currentIdx to always return -1 and the timeline
 * to render stuck at step 0 regardless of actual order status.
 *
 * RETURN_SUCCESSFUL uses green (terminal success).
 * All in-progress stages use amber per spec (#d97706).
 * CSS classes are defined in Orders.css (return-timeline,
 * order-timeline__dot--return-done, etc.).
 */

const RETURN_STAGES = [
  { key: "RETURN_REQUESTED",  label: "Return Requested",  icon: "🔄" },
  { key: "RETURN_APPROVED",   label: "Return Approved",   icon: "✅" },
  { key: "PICKUP_SCHEDULED",  label: "Pickup Scheduled",  icon: "📅" },
  { key: "PICKED_UP",         label: "Picked Up",         icon: "📦" },
  { key: "REFUND_PROCESSED",  label: "Refund Processed",  icon: "💸" },
  { key: "RETURN_SUCCESSFUL", label: "Return Successful", icon: "🎉" },
];

const ReturnTimeline = ({ status }) => {
  const upperStatus = (status ?? "RETURN_REQUESTED").toUpperCase();
  const currentIdx  = RETURN_STAGES.findIndex((s) => s.key === upperStatus);
  const activeIdx   = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="order-timeline return-timeline" role="list" aria-label="Return progress">
      {RETURN_STAGES.map((stage, idx) => {
        const done    = idx <= activeIdx;
        const current = idx === activeIdx;

        return (
          <div key={stage.key} className="order-timeline__step" role="listitem">
            {/* Dot */}
            <div
              className={[
                "order-timeline__dot",
                done    ? "order-timeline__dot--return-done"    : "",
                current ? "order-timeline__dot--return-current" : "",
              ].filter(Boolean).join(" ")}
            >
              {done
                ? <span role="img" aria-hidden="true">{stage.icon}</span>
                : <span className="order-timeline__dot-empty" aria-hidden="true" />}
            </div>

            {/* Label */}
            <span
              className={[
                "order-timeline__label",
                current          ? "order-timeline__label--return-current" : "",
                done && !current ? "order-timeline__label--return-done"    : "",
              ].filter(Boolean).join(" ")}
            >
              {stage.label}
            </span>

            {/* Connector line — not after last stage */}
            {idx < RETURN_STAGES.length - 1 && (
              <div
                className={[
                  "order-timeline__line",
                  idx < activeIdx ? "order-timeline__line--return" : "",
                ].filter(Boolean).join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReturnTimeline;
