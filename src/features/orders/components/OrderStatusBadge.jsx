/**
 * OrderStatusBadge
 *
 * FIX: Added all 6 return statuses + RETURNED fallback.
 * Return statuses use amber (#f59e0b / #fef3c7) per spec.
 * RETURN_SUCCESSFUL uses green — it is a terminal success state.
 */

const RETURN_AMBER_COLOR = "#92400e";
const RETURN_AMBER_BG    = "#fef3c7";

const STATUS_MAP = {
  // ── Delivery statuses (unchanged) ──────────────────────────────────
  PENDING:   { label: "Pending",   color: "#b45309", bg: "#fef3c7" },
  CONFIRMED: { label: "Confirmed", color: "#1d4ed8", bg: "#dbeafe" },
  PACKED:    { label: "Packed",    color: "#7c3aed", bg: "#ede9fe" },
  SHIPPED:   { label: "Shipped",   color: "#0369a1", bg: "#e0f2fe" },
  DELIVERED: { label: "Delivered", color: "#15803d", bg: "#dcfce7" },
  CANCELLED: { label: "Cancelled", color: "#b91c1c", bg: "#fee2e2" },

  // ── Return statuses (amber while in-progress, green when done) ──────
  RETURN_REQUESTED: { label: "Return Requested",  color: RETURN_AMBER_COLOR, bg: RETURN_AMBER_BG },
  RETURN_APPROVED:  { label: "Return Approved",   color: RETURN_AMBER_COLOR, bg: RETURN_AMBER_BG },
  PICKUP_SCHEDULED: { label: "Pickup Scheduled",  color: RETURN_AMBER_COLOR, bg: RETURN_AMBER_BG },
  PICKED_UP:        { label: "Picked Up",          color: RETURN_AMBER_COLOR, bg: RETURN_AMBER_BG },
  REFUND_PROCESSED: { label: "Refund Processed",  color: "#166534", bg: "#dcfce7" },
  RETURN_SUCCESSFUL:{ label: "Return Successful", color: "#166534", bg: "#dcfce7" },
  // Legacy alias kept for backwards compat
  RETURNED:         { label: "Returned",           color: "#166534", bg: "#dcfce7" },
};

const OrderStatusBadge = ({ status }) => {
  const s = STATUS_MAP[status?.toUpperCase()] ?? {
    label: status ?? "Unknown",
    color: "#555",
    bg: "#f3f4f6",
  };
  return (
    <span
      className="order-status-badge"
      style={{ color: s.color, background: s.bg }}
    >
      {s.label}
    </span>
  );
};

export default OrderStatusBadge;
