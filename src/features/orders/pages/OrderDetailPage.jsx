import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PATHS from "@/routes/paths";
import { cancelOrder } from "@/services/orderService";
import { formatCurrency } from "@/utils/currency";
import OrderItemsList from "../components/OrderItemsList";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderSummary from "../components/OrderSummary";
import OrderTimeline from "../components/OrderTimeline";
import ReturnModal from "../components/ReturnModal";
import ShippingInfo from "../components/ShippingInfo";
import { useOrder } from "../hooks/useOrders";
import { useReturn } from "../hooks/useReturn";
import { ORDER_IMAGE_PLACEHOLDER } from "../utils/normalizeOrder";
import "../styles/Orders.css";

/** Statuses where Cancel is allowed */
const CANCELLABLE = ["PENDING", "CONFIRMED"];
/** Statuses where Return is allowed */
const RETURNABLE  = ["DELIVERED"];

const OrderDetailPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { order, loading, error } = useOrder(id);
  const { returnStatus, requestReturn } = useReturn(id);

  const [cancelling,    setCancelling]    = useState(false);
  const [cancelError,   setCancelError]   = useState(null);
  const [cancelled,     setCancelled]     = useState(false);

  // Return state
  const [localReturnStatus, setLocalReturnStatus] = useState(null);
  const [returnModalOpen,   setReturnModalOpen]   = useState(false);
  const [returnSuccess,     setReturnSuccess]     = useState(false);
  const [returnError,       setReturnError]       = useState(null);
  const [returnLoading,     setReturnLoading]     = useState(false);

  // Preview image — start with placeholder, fill once order loads
  const [previewImgSrc, setPreviewImgSrc] = useState(ORDER_IMAGE_PLACEHOLDER);

  // Sync external returnStatus (from backend) into local state
  useEffect(() => {
    if (returnStatus) setLocalReturnStatus(returnStatus);
  }, [returnStatus]);

  // Update preview image once order data arrives
  useEffect(() => {
    const url = order?.items?.[0]?.imageUrl;
    if (url) setPreviewImgSrc(url);
  }, [order]);

  // ── Cancel ──────────────────────────────────────────────────────────────
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

  // ── Return ──────────────────────────────────────────────────────────────
  const handleReturnRequest = async (reason) => {
    setReturnLoading(true);
    setReturnError(null);
    try {
      setLocalReturnStatus("RETURN_REQUESTED");
      setReturnSuccess(true);
      setReturnModalOpen(false);
      setTimeout(() => setReturnSuccess(false), 5000);

      try {
        await requestReturn(reason);
      } catch {
        if (import.meta.env.DEV) {
          console.warn("[Return] backend call failed — UI updated optimistically");
        }
      }
    } finally {
      setReturnLoading(false);
    }
  };

  // ── Loading / error / not found ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="orders-page">
        <button
          className="orders-back"
          onClick={() => navigate(PATHS.ORDERS)}
          aria-label="Back to Orders"
        >
          ← Back to Orders
        </button>
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
        <button
          className="orders-back"
          onClick={() => navigate(PATHS.ORDERS)}
          aria-label="Back to Orders"
        >
          ← Back to Orders
        </button>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="orders-page">
        <button
          className="orders-back"
          onClick={() => navigate(PATHS.ORDERS)}
          aria-label="Back to Orders"
        >
          ← Back to Orders
        </button>
        <div className="orders-empty">
          <h2>Order not found</h2>
          <p>This order could not be located.</p>
        </div>
      </div>
    );
  }

  // ── Derived display state ──────────────────────────────────────────────
  const currentStatus = cancelled ? "CANCELLED" : order.status;
  const upperStatus   = currentStatus?.toUpperCase() ?? "PENDING";

  const canCancel = CANCELLABLE.includes(upperStatus) && !cancelled;
  const canReturn = RETURNABLE.includes(upperStatus) && !cancelled && !localReturnStatus;

  const timelineStatus = localReturnStatus ?? currentStatus;

  const shortId = order.id?.slice(-8).toUpperCase() || "UNKNOWN";
  const date    = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "N/A";

  const firstItem  = order.items?.[0];
  const extraCount = (order.items?.length ?? 0) - 1;

  return (
    <div className="orders-page order-detail-page">

      {/* ── Back button ── */}
      <button
        className="orders-back"
        onClick={() => navigate(PATHS.ORDERS)}
        aria-label="Back to Orders"
      >
        ← Back to Orders
      </button>

      {/* ── Header ── */}
      <div className="order-detail__header">
        <div>
          <h1 className="order-detail__title">Order #{shortId}</h1>
          <p className="order-detail__date">Placed on {date}</p>

          {/* Product preview strip: tiny image + name below the title */}
          {firstItem && (
            <div className="order-detail__product-preview">
              <img
                src={previewImgSrc}
                alt={firstItem.productName ?? "Product"}
                className="order-detail__preview-img"
                width={44}
                height={44}
                loading="lazy"
                onError={() => setPreviewImgSrc(ORDER_IMAGE_PLACEHOLDER)}
              />
              <span className="order-detail__preview-name">
                {firstItem.productName}
                {firstItem.unitPrice > 0 && (
                  <> &mdash; {formatCurrency(firstItem.unitPrice)}</>
                )}
              </span>
              {extraCount > 0 && (
                <span className="order-detail__preview-more">+{extraCount} more</span>
              )}
            </div>
          )}
        </div>
        <OrderStatusBadge status={currentStatus} />
      </div>

      {/* ── Timeline ── */}
      <div className="order-detail__timeline">
        <OrderTimeline status={timelineStatus} />
      </div>

      {/* ── Content grid ── */}
      <div className="order-detail__grid">
        <div className="order-detail__left">

          {/* Shipping Address */}
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Shipping Address</h3>
            <ShippingInfo address={order.address} />
          </div>

          {/* Products Ordered */}
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Products Ordered</h3>
            <OrderItemsList items={order.items} />
          </div>

          {/* Order Information */}
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Order Information</h3>
            <div className="shipping-info">
              <p className="shipping-info__line">Status: {currentStatus}</p>
              <p className="shipping-info__line">Items: {order.quantity}</p>
              <p className="shipping-info__line">Order date: {date}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="order-detail__section">
            <div className="order-detail__action-row">
              {canCancel && (
                <button
                  className="btn order-detail__cancel-btn"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling…" : "Cancel Order"}
                </button>
              )}
              {canReturn && (
                <button
                  className="btn order-detail__return-btn"
                  onClick={() => setReturnModalOpen(true)}
                  disabled={returnLoading}
                >
                  {returnLoading ? "Processing…" : "Return Order"}
                </button>
              )}
            </div>

            {cancelled          && <p className="order-detail__cancelled-msg">Order has been cancelled.</p>}
            {localReturnStatus  && (
              <p className="order-detail__return-status-msg">
                🔄 Return status: <strong>{localReturnStatus.replace(/_/g, " ")}</strong>
              </p>
            )}
            {returnSuccess  && <p className="order-detail__success-msg">✓ Return request submitted successfully!</p>}
            {cancelError    && <p className="error-text">{cancelError}</p>}
            {returnError    && <p className="error-text">{returnError}</p>}
          </div>
        </div>

        {/* Pricing Summary */}
        <aside className="order-detail__right">
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Pricing Summary</h3>
            <OrderSummary items={order.items} cartTotal={order.totalPrice} />
          </div>
        </aside>
      </div>

      {/* Return reason modal */}
      <ReturnModal
        isOpen={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        onConfirm={handleReturnRequest}
        isLoading={returnLoading}
      />
    </div>
  );
};

export default OrderDetailPage;
