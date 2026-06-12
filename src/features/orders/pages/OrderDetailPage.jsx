import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import { cancelOrder } from "@/services/orderService";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderTimeline from "../components/OrderTimeline";
import OrderItemsList from "../components/OrderItemsList";
import ShippingInfo from "../components/ShippingInfo";
import OrderSummary from "../components/OrderSummary";
import PATHS from "@/routes/paths";
import "../styles/Orders.css";

const CANCELLABLE = ["PENDING", "CONFIRMED"];

const OrderDetailPage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { order, loading, error } = useOrder(id);
  const [cancelling,  setCancelling]  = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelled,   setCancelled]   = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    setCancelError(null);
    try {
      await cancelOrder(id);
      setCancelled(true);
    } catch (err) {
      setCancelError(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  /* ── Loading ────────────────────────────────────────── */
  if (loading)
    return (
      <div className="orders-page">
        <div className="order-detail-skeleton">
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: "60%" }} />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="orders-page">
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)}>
          ← Back to Orders
        </button>
        <p className="error-text">{error}</p>
      </div>
    );

  if (!order) return null;

  const currentStatus = cancelled ? "CANCELLED" : order.status;
  const canCancel     =
    CANCELLABLE.includes(currentStatus?.toUpperCase()) && !cancelled;
  const shortId = order.id?.slice(-8).toUpperCase();
  const date    = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  return (
    <div className="orders-page order-detail-page">
      <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)}>
        ← Back to Orders
      </button>

      {/* Header */}
      <div className="order-detail__header">
        <div>
          <h1 className="order-detail__title">Order # {shortId}</h1>
          <p className="order-detail__date">Placed on {date}</p>
        </div>
        <OrderStatusBadge status={currentStatus} />
      </div>

      {/* Timeline */}
      <div className="order-detail__timeline">
        <OrderTimeline status={currentStatus} />
      </div>

      {/* Main grid */}
      <div className="order-detail__grid">
        {/* LEFT — items + shipping */}
        <div className="order-detail__left">
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Delivery Address</h3>
            <ShippingInfo address={order.address} />
          </div>

          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Ordered Items</h3>
            <OrderItemsList items={order.items ?? []} />
          </div>

          <div className="order-detail__section">
            {canCancel && (
              <button
                className="btn order-detail__cancel-btn"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </button>
            )}
            {cancelled && (
              <p className="order-detail__cancelled-msg">
                ✅ Order has been cancelled.
              </p>
            )}
            {cancelError && <p className="error-text">{cancelError}</p>}
          </div>
        </div>

        {/* RIGHT — price summary */}
        <aside className="order-detail__right">
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Price Details</h3>
            <OrderSummary
              items={order.items ?? []}
              cartTotal={order.totalPrice ?? 0}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetailPage;
