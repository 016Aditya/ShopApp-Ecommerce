const STATUS_STYLES = {
  PENDING:   "status--pending",
  CONFIRMED: "status--confirmed",
  SHIPPED:   "status--shipped",
  DELIVERED: "status--delivered",
  CANCELLED: "status--cancelled",
};

const OrderStatus = ({ status }) => {
  const cls = STATUS_STYLES[status?.toUpperCase()] ?? "status--pending";
  return (
    <span className={`status-badge ${cls}`}>
      {status ?? "PENDING"}
    </span>
  );
};

export default OrderStatus;