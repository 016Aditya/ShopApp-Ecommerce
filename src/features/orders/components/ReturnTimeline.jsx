import "../styles/ReturnTimeline.css";

const RETURN_STATUSES = [
  { key: "RETURN_REQUESTED", label: "Return Requested", icon: "🔄" },
  { key: "PICKUP_SCHEDULED", label: "Pickup Scheduled", icon: "📅" },
  { key: "PICKED_UP", label: "Picked Up", icon: "📦" },
  { key: "REFUND_PROCESSED", label: "Refund Processed", icon: "💳" },
  { key: "REFUND_COMPLETED", label: "Refund Completed", icon: "✅" },
];

const ReturnTimeline = ({ status = "RETURN_REQUESTED" }) => {
  const currentStatusIndex = RETURN_STATUSES.findIndex(s => s.key === status);
  
  // Determine if this is the current step (incomplete, in progress)
  // or a completed step (status index < current index)
  const getStepStatus = (index) => {
    if (index < currentStatusIndex) return "completed";
    if (index === currentStatusIndex) return "current";
    return "pending";
  };

  return (
    <div className="return-timeline">
      <div className="return-timeline__header">
        <h4 className="return-timeline__title">Return Progress</h4>
        <span className="return-timeline__current-status">
          {RETURN_STATUSES[currentStatusIndex]?.label || "Processing"}
        </span>
      </div>

      <div className="return-timeline__steps">
        {RETURN_STATUSES.map((step, index) => {
          const stepStatus = getStepStatus(index);
          const isLast = index === RETURN_STATUSES.length - 1;

          return (
            <div key={step.key} className="return-timeline__step-wrapper">
              <div className={`return-timeline__step return-timeline__step--${stepStatus}`}>
                <div className="return-timeline__step-icon">
                  <span className="return-timeline__icon-text">{step.icon}</span>
                </div>
                <div className="return-timeline__step-content">
                  <p className="return-timeline__step-label">{step.label}</p>
                  {stepStatus === "completed" && (
                    <p className="return-timeline__step-meta">Completed</p>
                  )}
                  {stepStatus === "current" && (
                    <p className="return-timeline__step-meta">In progress</p>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className={`return-timeline__connector return-timeline__connector--${stepStatus}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="return-timeline__footer">
        <p className="return-timeline__footer-text">
          {currentStatusIndex === RETURN_STATUSES.length - 1
            ? "Your refund has been completed."
            : "Your return is being processed."}
        </p>
      </div>
    </div>
  );
};

export default ReturnTimeline;
