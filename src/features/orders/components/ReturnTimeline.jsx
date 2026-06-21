/**
 * ReturnTimeline
 *
 * FIX: Stage keys now match the backend enum exactly:
 *   RETURN_REQUESTED → RETURN_APPROVED → PICKUP_SCHEDULED → PICKED_UP
 *   → REFUND_PROCESSED → RETURN_SUCCESSFUL
 *
 * Previous keys RETURN_CONFIRMED and ITEM_PICKED_UP did not exist on the
 * backend, causing currentIdx to always return -1 and the timeline to
 * show step 0 regardless of actual status.
 *
 * CSS: Uses classes already defined in Orders.css (return-timeline,
 * order-timeline__dot--return-done, etc.). ReturnTimeline.css is not
 * imported here because it uses a completely different class naming
 * convention and would be a dead override.
 */

const RETURN_STAGES = [
  { key: "RETURN_REQUESTED",  label: "Return Requested", icon: "🔄" },
  { key: "RETURN_APPROVED",   label: "Return Approved",  icon: "✅" },
  { key: "PICKUP_SCHEDULED",  label: "Pickup Scheduled", icon: "📅" },
  { key: "PICKED_UP",         label: "Picked Up",        icon: "📦" },
  { key: "REFUND_PROCESSED",  label: "Refund Processed", icon: "💸" },
  { key: "RETURN_SUCCESSFUL", label: "Return Successful",icon: "🎉" },
];

const ReturnTimeline = ({ status }) => {
  const upperStatus = (status ?? "RETURN_REQUESTED").toUpperCase();

  const currentIdx = RETURN_STAGES.findIndex((s) => s.key === upperStatus);
  const activeIdx  = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="order-timeline return-timeline">
      {RETURN_STAGES.map((stage, idx) => {
        const done    = idx <= activeIdx;
        const current = idx === activeIdx;

        return (
          <div key={stage.key} className="order-timeline__step">
            {/* Dot */}
            <div
              className={
                "order-timeline__dot" +
                (done    ? " order-timeline__dot--return-done"    : "") +
                (current ? " order-timeline__dot--return-current" : "")
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
                (current          ? " order-timeline__label--return-current" : "") +
                (done && !current ? " order-timeline__label--return-done"    : "")
              }
            >
              {stage.label}
            </span>

            {/* Connector line */}
            {idx < RETURN_STAGES.length - 1 && (
              <div
                className={
                  "order-timeline__line" +
                  (idx < activeIdx ? " order-timeline__line--return" : "")
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReturnTimeline;
