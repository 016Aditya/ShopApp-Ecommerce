/**
 * OrderStatusBadge
 *
 * FIX: Added all 6 return statuses + RETURNED legacy alias.
 * Return in-progress statuses use amber per spec (#f59e0b / #fef3c7).
 * REFUND_PROCESSED and RETURN_SUCCESSFUL use green — terminal success states.
 * All existing delivery statuses are unchanged.
 */

const AMBER = { color: "#92400e", bg: "#fef3c7" };
const GREEN = { color: "#166534", bg: "#dcfce7" };

const STATUS_MAP = {
  // ── Delivery statuses (unchanged) ──────────────────────────────────
  PENDING:   { label: "Pending",   color: "#b45309", bg: "#fef3c7" },
  CONFIRMED: { label: "Confirmed", color: "#1d4ed8", bg: "#dbeafe" },
  PACKED:    { label: "Packed",    color: "#7c3aed", bg: "#ede9fe" },
  SHIPPED:   { label: "Shipped",   color: "#0369a1", bg: "#e0f2fe" },
  DELIVERED: { label: "Delivered", color: "#15803d", bg: "#dcfce7" },
  CANCELLED: { label: "Cancelled", color: "#b91c1c", bg: "#fee2e2" },

  // ── Return in-progress statuses (amber) ────────────────────────────
  RETURN_REQUESTED: { label: "Return Requested", ...AMBER },
  RETURN_APPROVED:  { label: "Return Approved",  ...AMBER },
  PICKUP_SCHEDULED: { label: "Pickup Scheduled", ...AMBER },
  PICKED_UP:        { label: "Picked Up",         ...AMBER },

  // ── Return terminal success statuses (green) ───────────────────────
  REFUND_PROCESSED:  { label: "Refund Processed",  ...GREEN },
  RETURN_SUCCESSFUL: { label: "Return Successful", ...GREEN },
  RETURNED:          { label: "Returned",           ...GREEN }, // legacy alias
};

const OrderStatusBadge = ({ status }) => {
  const s = STATUS_MAP[status?.toUpperCase()] ?? {
    label: status ?? "Unknown",
    color: "#6b7280",
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
