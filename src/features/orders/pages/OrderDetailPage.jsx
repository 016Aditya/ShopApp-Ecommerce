import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import OrderStatus from "../components/OrderStatus";
import { formatCurrency } from "@/utils/currency";
import PATHS from "@/routes/paths";

const OrderDetailPage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { order, loading, error } = useOrder(id);

  if (loading) return <p className="loading-text">Loading order...</p>;
  if (error)   return <p className="error-text">{error}</p>;
  if (!order)  return null;

  return (
    <div className="page order-detail-page">
      <button className="btn btn--ghost btn--sm" onClick={() => navigate(PATHS.ORDERS)}>
        ← Back to Orders
      </button>

      <div className="order-detail">
        <div className="order-detail__header">
          <h1 className="page__title">Order #{order.id?.slice(-6).toUpperCase()}</h1>
          <OrderStatus status={order.status} />
        </div>

        <div className="order-detail__grid">
          <div className="order-detail__section">
            <h3>Delivery Address</h3>
            <p>{order.address?.line1}</p>
            <p>{order.address?.city}, {order.address?.state} - {order.address?.zipCode}</p>
            <p>{order.address?.country}</p>
          </div>

          <div className="order-detail__section">
            <h3>Order Info</h3>
            <p>Items ordered: {order.quantity}</p>
            <p>Total: <strong>{formatCurrency(order.totalPrice)}</strong></p>
            <p>Placed on: {order.createdAt
              ? new Date(order.createdAt).toLocaleString("en-IN")
              : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;