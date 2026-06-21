// src/features/orders/components/ReturnTimeline.jsx
import "../styles/ReturnTimeline.css";

/**
 * ReturnTimeline
 *
 * Root-cause fix: stage keys previously used RETURN_CONFIRMED and ITEM_PICKED_UP
 * which do not exist in the backend OrderStatus enum — causing currentIdx === -1
 * always, freezing the timeline at step 0 regardless of real status.
 *
 * Fixed keys (must exactly match backend enum):
 *   RETURN_REQUESTED → RETURN_APPROVED → PICKUP_SCHEDULED
 *   → PICKED_UP → REFUND_PROCESSED → RETURN_SUCCESSFUL
 *
 * Colors:
 *   In-progress stages : amber  (#f59e0b)
 *   Completed stages   : amber  (#f59e0b) with filled dot
 *   Terminal success   : green  (#22c55e) for RETURN_SUCCESSFUL
 *   Connector lines    : amber  for completed, muted for pending
 */

const RETURN_STAGES = [
  { key: "RETURN_REQUESTED",  label: "Return Requested",  icon: "↩" },
  { key: "RETURN_APPROVED",   label: "Return Approved",   icon: "✓" },
  { key: "PICKUP_SCHEDULED",  label: "Pickup Scheduled",  icon: "📅" },
  { key: "PICKED_UP",         label: "Picked Up",          icon: "📦" },
  { key: "REFUND_PROCESSED",  label: "Refund Processed",  icon: "💸" },
  { key: "RETURN_SUCCESSFUL", label: "Return Successful", icon: "✓" },
];

const AMBER   = "#f59e0b";
const GREEN   = "#22c55e";
const MUTED   = "var(--text-tertiary, #9ca3af)";
const MUTED_LINE = "var(--border-color, #e5e7eb)";

const ReturnTimeline = ({ status }) => {
  const upperStatus = (status ?? "RETURN_REQUESTED").toUpperCase();
  const currentIdx  = RETURN_STAGES.findIndex((s) => s.key === upperStatus);
  // If backend returns an unrecognised status, default to 0 (first step)
  const activeIdx   = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="return-timeline" role="list" aria-label="Return progress">
      <p className="return-timeline__heading">Return Progress</p>

      {RETURN_STAGES.map((stage, idx) => {
        const isSuccess  = stage.key === "RETURN_SUCCESSFUL";
        const isDone     = idx <= activeIdx;
        const isCurrent  = idx === activeIdx;

        const dotColor  = isDone ? (isSuccess && isDone ? GREEN : AMBER) : MUTED;
        const lineColor = idx < activeIdx ? AMBER : MUTED_LINE;
        const labelColor = isCurrent
          ? (isSuccess ? GREEN : AMBER)
          : isDone
          ? (isSuccess ? GREEN : AMBER)
          : MUTED;

        return (
          <div key={stage.key} className="return-timeline__step" role="listitem">
            {/* Connector line above (skip for first item) */}
            {idx > 0 && (
              <div
                className="return-timeline__line"
                style={{ background: lineColor }}
                aria-hidden="true"
              />
            )}

            <div className="return-timeline__row">
              {/* Dot */}
              <div
                className={[
                  "return-timeline__dot",
                  isDone ? "return-timeline__dot--filled" : "",
                ].join(" ").trim()}
                style={{
                  borderColor: dotColor,
                  background:  isDone ? dotColor : "transparent",
                }}
                aria-hidden="true"
              >
                {isDone && (
                  <span className="return-timeline__dot-icon">
                    {stage.icon}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={[
                  "return-timeline__label",
                  isCurrent ? "return-timeline__label--current" : "",
                  isDone && !isCurrent ? "return-timeline__label--done" : "",
                ].join(" ").trim()}
                style={{ color: labelColor }}
              >
                {stage.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReturnTimeline;
