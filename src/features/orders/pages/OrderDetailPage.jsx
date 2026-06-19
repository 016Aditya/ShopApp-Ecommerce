import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PATHS from "@/routes/paths";
import { cancelOrder } from "@/services/orderService";
import OrderItemsList from "../components/OrderItemsList";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderSummary from "../components/OrderSummary";
import OrderTimeline from "../components/OrderTimeline";
import ReturnTimeline from "../components/ReturnTimeline";
import ReturnModal from "../components/ReturnModal";
import ShippingInfo from "../components/ShippingInfo";
import { useOrder } from "../hooks/useOrders";
import { useReturn } from "../hooks/useReturn";
import "../styles/Orders.css";

const CANCELLABLE = ["PENDING", "CONFIRMED"];
const RETURNABLE = ["DELIVERED"];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, loading, error } = useOrder(id);
  const { returnStatus, loading: returnLoading, requestReturn } = useReturn(id);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnError, setReturnError] = useState(null);
  const [returnSuccess, setReturnSuccess] = useState(false);
  const [currentReturnStatus, setCurrentReturnStatus] = useState(returnStatus);

  useEffect(() => {
    setCurrentReturnStatus(returnStatus);
  }, [returnStatus]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

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

  const handleReturnRequest = async (reason) => {
    try {
      setReturnError(null);
      const result = await requestReturn(reason);
      setCurrentReturnStatus(result?.status || "RETURN_REQUESTED");
      setReturnSuccess(true);
      setIsReturnModalOpen(false);
      // Clear success message after 5 seconds
      setTimeout(() => setReturnSuccess(false), 5000);
    } catch (err) {
      setReturnError(err.message || "Failed to initiate return");
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="order-detail-skeleton">
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-text" style={{ width: "60%" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)}>
          Back to Orders
        </button>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="orders-page">
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)}>
          Back to Orders
        </button>
        <div className="orders-empty">
          <h2>Order not found</h2>
          <p>This order could not be located.</p>
        </div>
      </div>
    );
  }

  const currentStatus = cancelled ? "CANCELLED" : order.status;
  const canCancel = CANCELLABLE.includes(currentStatus?.toUpperCase()) && !cancelled;
  const canReturn = RETURNABLE.includes(currentStatus?.toUpperCase()) && !cancelled && !currentReturnStatus;
  const shortId = order.id?.slice(-8).toUpperCase() || "UNKNOWN";
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="orders-page order-detail-page">
      <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)}>
        Back to Orders
      </button>

      <div className="order-detail__header">
        <div>
          <h1 className="order-detail__title">Order #{shortId}</h1>
          <p className="order-detail__date">Placed on {date}</p>
        </div>
        <OrderStatusBadge status={currentStatus} />
      </div>

      <div className="order-detail__timeline">
        <OrderTimeline status={currentStatus} />
      </div>

      {currentReturnStatus && (
        <div className="order-detail__return-timeline">
          <ReturnTimeline status={currentReturnStatus} />
        </div>
      )}

      <div className="order-detail__grid">
        <div className="order-detail__left">
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Shipping Address</h3>
            <ShippingInfo address={order.address} />
          </div>

          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Products Ordered</h3>
            <OrderItemsList items={order.items} />
          </div>

          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Order Information</h3>
            <div className="shipping-info">
              <p className="shipping-info__line">Status: {currentStatus}</p>
              <p className="shipping-info__line">Items: {order.quantity}</p>
              <p className="shipping-info__line">Order date: {date}</p>
            </div>
          </div>

          <div className="order-detail__section">
            {canCancel && (
              <button
                className="btn order-detail__cancel-btn"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            {canReturn && (
              <button
                className="btn order-detail__return-btn"
                onClick={() => setIsReturnModalOpen(true)}
                disabled={returnLoading}
              >
                {returnLoading ? "Processing..." : "Return Order"}
              </button>
            )}
            {cancelled && <p className="order-detail__cancelled-msg">Order has been cancelled.</p>}
            {returnSuccess && (
              <p className="order-detail__success-msg">✓ Return request submitted successfully!</p>
            )}
            {cancelError && <p className="error-text">{cancelError}</p>}
            {returnError && <p className="error-text">{returnError}</p>}
          </div>
        </div>

        <aside className="order-detail__right">
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Pricing Summary</h3>
            <OrderSummary items={order.items} cartTotal={order.totalPrice} />
          </div>
        </aside>
      </div>

      <ReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onConfirm={handleReturnRequest}
        isLoading={returnLoading}
      />
    </div>
  );
};

export default OrderDetailPage;
