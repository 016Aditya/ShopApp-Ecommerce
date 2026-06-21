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
 * Both buttons are ALWAYS rendered — disabled states communicate
 * unavailability instead of hiding buttons entirely.
 *
 * PENDING    → Cancel ✓  Return ✗
 * CONFIRMED  → Cancel ✓  Return ✗
 * PACKED     → Cancel ✗  Return ✗
 * SHIPPED    → Cancel ✗  Return ✗
 * DELIVERED  → Cancel ✗  Return ✓  ← only state where Return is active
 * RETURN_*   → Cancel ✗  Return ✗  (already in return flow)
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

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

const OrderDetailPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
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

  // Sync external returnStatus (from useReturn hook) into local state
  useEffect(() => {
    if (returnStatus) setLocalReturnStatus(returnStatus);
  }, [returnStatus]);

  // Seed localReturnStatus from order.status on load
  // (handles page reload when order is already in return flow)
  useEffect(() => {
    if (order && RETURN_STATUSES.has(order.status?.toUpperCase())) {
      setLocalReturnStatus(order.status.toUpperCase());
    }
  }, [order]);

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
  const handleReturnRequest = async () => {
    setReturnLoading(true);
    setReturnError(null);
    // Optimistic UI — update immediately so the dual timeline appears at once
    setLocalReturnStatus("RETURN_REQUESTED");
    setReturnModalOpen(false);
    try {
      const updated = await requestReturn();
      // Sync orderStore so the Orders list page reflects new status
      // without requiring a full refetch
      useOrderStore.getState().updateOrderReturn(id, {
        status:            updated?.status            ?? "RETURN_REQUESTED",
        returnRequestedAt: updated?.returnRequestedAt ?? new Date().toISOString(),
        refundStatus:      updated?.refundStatus      ?? "PENDING",
      });
      setReturnSuccess(true);
      setTimeout(() => setReturnSuccess(false), 5000);
    } catch (err) {
      // Revert optimistic update on failure
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

  // ── Derived display state ─────────────────────────────────────────────────
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

  // Return info fields — null-safe for old orders without these fields
  const returnRequestedOn = formatDate(order.returnRequestedAt);
  const returnCompletedOn = formatDate(order.returnCompletedAt);

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

      {/* ── Unified Timeline section ── */}
      {/*
        Single horizontal timeline showing delivery progress and return progress
        when the order enters the return flow. Return stages are appended to the
        delivery timeline without creating a separate box or section.
      */}
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
              <p className="shipping-info__line">Status: {currentStatus}</p>
              <p className="shipping-info__line">Items: {order.quantity}</p>
              <p className="shipping-info__line">Order date: {date}</p>
            </div>
          </div>

          {/*
            Return Information panel — only shown when in return flow.
            All fields are null-safe: old orders without returnRequestedAt
            or refundStatus will simply not render those lines.
          */}
          {isReturnFlow && (
            <div className="order-detail__section order-detail__return-info">
              <h3 className="order-detail__section-title">Return Information</h3>
              <div className="shipping-info">
                <p className="shipping-info__line">
                  <span className="order-detail__return-info-label">Return Status:</span>{" "}
                  <span className="order-detail__return-info-value">
                    {localReturnStatus}
                  </span>
                </p>
                {returnRequestedOn && (
                  <p className="shipping-info__line">
                    <span className="order-detail__return-info-label">Return Requested On:</span>{" "}
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
                    {order.refundStatus ?? "PENDING"}
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

              <button
                className="btn order-detail__return-btn"
                onClick={() => setReturnModalOpen(true)}
                disabled={returnDisabled}
                aria-label="Request a return for this order"
              >
                {returnLoading ? "Processing…" : "↩ Return Order"}
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

      {/* Return confirmation modal */}
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
