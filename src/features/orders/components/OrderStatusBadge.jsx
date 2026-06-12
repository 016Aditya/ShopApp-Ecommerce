const STATUS_MAP = {
  PENDING:   { label: "Pending",   color: "#b45309", bg: "#fef3c7" },
  CONFIRMED: { label: "Confirmed", color: "#1d4ed8", bg: "#dbeafe" },
  PACKED:    { label: "Packed",    color: "#7c3aed", bg: "#ede9fe" },
  SHIPPED:   { label: "Shipped",   color: "#0369a1", bg: "#e0f2fe" },
  DELIVERED: { label: "Delivered", color: "#15803d", bg: "#dcfce7" },
  CANCELLED: { label: "Cancelled", color: "#b91c1c", bg: "#fee2e2" },
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
