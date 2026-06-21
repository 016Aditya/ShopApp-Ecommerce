import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PATHS from "@/routes/paths";
import { cancelOrder } from "@/services/orderService";
import { formatCurrency } from "@/utils/currency";
import { useOrderStore } from "@/store/orderStore";
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

/**
 * Business rules for Cancel / Return buttons.
 * PENDING    → Cancel ✓  Return ✗
 * CONFIRMED  → Cancel ✓  Return ✗
 * PACKED     → Cancel ✗  Return ✗
 * SHIPPED    → Cancel ✗  Return ✗
 * DELIVERED  → Cancel ✗  Return ✓
 * RETURN_*   → Cancel ✗  Return ✗
 * CANCELLED  → Cancel ✗  Return ✗
 */
const CANCELLABLE = new Set(["PENDING", "CONFIRMED"]);
const RETURNABLE  = new Set(["DELIVERED"]);

const RETURN_STATUSES = new Set([
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "REFUND_PROCESSED",
  "RETURN_SUCCESSFUL",
  "RETURNED",
]);

/** Convert enum → readable label for Order Information section */
const STATUS_LABELS = {
  PENDING:           "Pending",
  CONFIRMED:         "Confirmed",
  PACKED:            "Packed",
  SHIPPED:           "Shipped",
  DELIVERED:         "Delivered",
  CANCELLED:         "Cancelled",
  RETURN_REQUESTED:  "Return Requested",
  RETURN_APPROVED:   "Return Approved",
  PICKUP_SCHEDULED:  "Pickup Scheduled",
  PICKED_UP:         "Picked Up",
  REFUND_PROCESSED:  "Refund Processed",
  RETURN_SUCCESSFUL: "Return Successful",
  RETURNED:          "Returned",
};

/** Convert refund enum → readable label */
const REFUND_LABELS = {
  PENDING:   "Pending",
  PROCESSED: "Processed",
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

const OrderDetailPage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { order, loading, error } = useOrder(id);
  const { returnStatus, requestReturn } = useReturn(id);

  const [cancelling,  setCancelling]  = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancelled,   setCancelled]   = useState(false);

  const [localReturnStatus, setLocalReturnStatus] = useState(null);
  const [returnModalOpen,   setReturnModalOpen]   = useState(false);
  const [returnSuccess,     setReturnSuccess]     = useState(false);
  const [returnError,       setReturnError]       = useState(null);
  const [returnLoading,     setReturnLoading]     = useState(false);

  const [previewImgSrc, setPreviewImgSrc] = useState(ORDER_IMAGE_PLACEHOLDER);

  useEffect(() => {
    if (returnStatus) setLocalReturnStatus(returnStatus);
  }, [returnStatus]);

  useEffect(() => {
    if (order && RETURN_STATUSES.has(order.status?.toUpperCase())) {
      setLocalReturnStatus(order.status.toUpperCase());
    }
  }, [order]);

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
  const handleReturnRequest = async () => {
    setReturnLoading(true);
    setReturnError(null);
    setLocalReturnStatus("RETURN_REQUESTED");
    setReturnModalOpen(false);
    try {
      const updated = await requestReturn();
      useOrderStore.getState().updateOrderReturn(id, {
        status:            updated?.status            ?? "RETURN_REQUESTED",
        returnRequestedAt: updated?.returnRequestedAt ?? new Date().toISOString(),
        refundStatus:      updated?.refundStatus      ?? "PENDING",
      });
      setReturnSuccess(true);
      setTimeout(() => setReturnSuccess(false), 5000);
    } catch (err) {
      setLocalReturnStatus(null);
      setReturnError(err.message || "Failed to initiate return. Please try again.");
    } finally {
      setReturnLoading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="orders-page">
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)} aria-label="Back to Orders">
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
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)} aria-label="Back to Orders">
          ← Back to Orders
        </button>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="orders-page">
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)} aria-label="Back to Orders">
          ← Back to Orders
        </button>
        <div className="orders-empty">
          <h2>Order not found</h2>
          <p>This order could not be located.</p>
        </div>
      </div>
    );
  }

  // ── Derived display state ────────────────────────────────────────────────
  const currentStatus = cancelled ? "CANCELLED" : order.status;
  const upperStatus   = currentStatus?.toUpperCase() ?? "PENDING";

  const cancelDisabled = !CANCELLABLE.has(upperStatus) || cancelled || cancelling;
  const returnDisabled =
    !RETURNABLE.has(upperStatus) || cancelled || !!localReturnStatus || returnLoading;

  const isReturnFlow = !!localReturnStatus;

  const shortId = order.id?.slice(-8).toUpperCase() || "UNKNOWN";
  const date    = formatDate(order.createdAt) ?? "N/A";

  const firstItem  = order.items?.[0];
  const extraCount = (order.items?.length ?? 0) - 1;

  // Readable label for return button after submit
  const returnBtnLabel = returnLoading
    ? "Processing…"
    : localReturnStatus
    ? "Return Requested"
    : "↩ Return Order";

  // Return info fields
  const returnRequestedOn = formatDate(order.returnRequestedAt);
  const returnCompletedOn = formatDate(order.returnCompletedAt);

  // Human-readable status label for Order Information
  const displayStatus  = STATUS_LABELS[upperStatus] ?? currentStatus;
  const displayRefund  = order.refundStatus
    ? (REFUND_LABELS[order.refundStatus?.toUpperCase()] ?? order.refundStatus)
    : "Pending";

  return (
    <div className="orders-page order-detail-page">

      {/* ── Back ── */}
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

          {firstItem && (
            <div className="order-detail__product-preview">
              <img
                src={previewImgSrc}
                alt={firstItem.productName ?? "Product"}
                className="order-detail__preview-img"
                width={48}
                height={48}
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

      {/* ── Unified Timeline ── */}
      <div className="order-detail__timeline">
        <OrderTimeline
          status={localReturnStatus || currentStatus}
          isReturnFlow={isReturnFlow}
        />
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
              <p className="shipping-info__line">Status: {displayStatus}</p>
              <p className="shipping-info__line">Items: {order.quantity}</p>
              <p className="shipping-info__line">Order date: {date}</p>
            </div>
          </div>

          {/* Return Information — only in return flow */}
          {isReturnFlow && (
            <div className="order-detail__section order-detail__return-info">
              <h3 className="order-detail__section-title">Return Information</h3>
              <div className="shipping-info">
                <p className="shipping-info__line">
                  <span className="order-detail__return-info-label">Return Status:</span>{" "}
                  <span className="order-detail__return-info-value">
                    {STATUS_LABELS[localReturnStatus] ?? localReturnStatus}
                  </span>
                </p>
                {returnRequestedOn && (
                  <p className="shipping-info__line">
                    <span className="order-detail__return-info-label">Requested On:</span>{" "}
                    {returnRequestedOn}
                  </p>
                )}
                {returnCompletedOn && (
                  <p className="shipping-info__line">
                    <span className="order-detail__return-info-label">Return Completed On:</span>{" "}
                    {returnCompletedOn}
                  </p>
                )}
                <p className="shipping-info__line">
                  <span className="order-detail__return-info-label">Refund Status:</span>{" "}
                  <span className="order-detail__return-info-value">
                    {displayRefund}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* ── Action buttons ── */}
          <div className="order-detail__section">
            <div className="order-detail__action-row">
              <button
                className="btn order-detail__cancel-btn"
                onClick={handleCancel}
                disabled={cancelDisabled}
                aria-label="Cancel this order"
              >
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </button>

              {/*
                Return button:
                - Active (DELIVERED, not yet requested): amber, enabled
                - After request submitted: "Return Requested", amber, disabled, cursor not-allowed
                - Any other state: dimmed (opacity 0.6), cursor not-allowed
              */}
              <button
                className={[
                  "btn order-detail__return-btn",
                  localReturnStatus ? "order-detail__return-btn--requested" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => setReturnModalOpen(true)}
                disabled={returnDisabled}
                aria-label="Request a return for this order"
              >
                {returnBtnLabel}
              </button>
            </div>

            {cancelled     && <p className="order-detail__cancelled-msg">Order has been cancelled.</p>}
            {returnSuccess && <p className="order-detail__success-msg">✓ Return request submitted successfully!</p>}
            {cancelError   && <p className="error-text">{cancelError}</p>}
            {returnError   && <p className="error-text">{returnError}</p>}
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
