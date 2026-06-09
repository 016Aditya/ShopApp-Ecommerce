import { useNavigate } from "react-router-dom";
import { buildPath } from "@/routes/paths";
import PATHS from "@/routes/paths";
import { formatCurrency } from "@/utils/currency";
import OrderStatus from "./OrderStatus";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div
      className="order-card"
      onClick={() => navigate(buildPath(PATHS.ORDER_DETAIL, order.id))}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(buildPath(PATHS.ORDER_DETAIL, order.id))}
    >
      <div className="order-card__header">
        <span className="order-card__id">Order #{order.id?.slice(-6).toUpperCase()}</span>
        <OrderStatus status={order.status} />
      </div>

      <div className="order-card__details">
        <p>Items: {order.quantity}</p>
        <p>Total: <strong>{formatCurrency(order.totalPrice)}</strong></p>
        <p className="order-card__date">
          {order.createdAt
            ? new Date(order.createdAt).toLocaleDateString("en-IN")
            : "—"}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;