/**
 * ReturnTimeline
 *
 * Dedicated progress bar shown ONLY when a return has been initiated.
 * Stages: Return Placed → Return Confirmed → Pickup Scheduled → Item Picked Up → Refund Processed
 *
 * Displayed in place of the regular OrderTimeline once localReturnStatus is set.
 */

const RETURN_STAGES = [
  { key: "RETURN_REQUESTED",    label: "Return Placed",       icon: "🔄" },
  { key: "RETURN_CONFIRMED",    label: "Return Confirmed",    icon: "✅" },
  { key: "PICKUP_SCHEDULED",    label: "Pickup Scheduled",   icon: "📅" },
  { key: "ITEM_PICKED_UP",      label: "Item Picked Up",     icon: "📦" },
  { key: "REFUND_PROCESSED",    label: "Refund Processed",   icon: "💸" },
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
