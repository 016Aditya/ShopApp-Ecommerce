/**
 * ReturnTimeline
 *
 * FIX: Stage keys now match backend OrderStatus enum exactly:
 *   RETURN_REQUESTED → RETURN_APPROVED → PICKUP_SCHEDULED
 *   → PICKED_UP → REFUND_PROCESSED → RETURN_SUCCESSFUL
 *
 * Previous keys (RETURN_CONFIRMED, ITEM_PICKED_UP) did not exist in the
 * backend enum — causing currentIdx === -1 always, freezing the timeline
 * at step 0 regardless of actual status.
 *
 * Colors per spec:
 *   In-progress stages  → amber  (#d97706)
 *   RETURN_SUCCESSFUL   → green  (#22c55e) — terminal success
 */

const RETURN_STAGES = [
  { key: "RETURN_REQUESTED",  label: "Return Requested",  icon: "\uD83D\uDD04" },
  { key: "RETURN_APPROVED",   label: "Return Approved",   icon: "\u2705" },
  { key: "PICKUP_SCHEDULED",  label: "Pickup Scheduled",  icon: "\uD83D\uDCC5" },
  { key: "PICKED_UP",         label: "Picked Up",         icon: "\uD83D\uDCE6" },
  { key: "REFUND_PROCESSED",  label: "Refund Processed",  icon: "\uD83D\uDCB8" },
  { key: "RETURN_SUCCESSFUL", label: "Return Successful", icon: "\uD83C\uDF89" },
];

const ReturnTimeline = ({ status }) => {
  const upperStatus = (status ?? "RETURN_REQUESTED").toUpperCase();
  const currentIdx  = RETURN_STAGES.findIndex((s) => s.key === upperStatus);
  // If status not found (e.g. legacy RETURNED alias) default to step 0
  const activeIdx   = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div
      className="order-timeline return-timeline"
      role="list"
      aria-label="Return progress"
    >
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
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {done ? (
                <span role="img" aria-hidden="true">{stage.icon}</span>
              ) : (
                <span className="order-timeline__dot-empty" aria-hidden="true" />
              )}
            </div>

            {/* Label */}
            <span
              className={[
                "order-timeline__label",
                current          ? "order-timeline__label--return-current" : "",
                done && !current ? "order-timeline__label--return-done"    : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {stage.label}
            </span>

            {/* Connector line — not after last step */}
            {idx < RETURN_STAGES.length - 1 && (
              <div
                className={[
                  "order-timeline__line",
                  idx < activeIdx ? "order-timeline__line--return" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReturnTimeline;
