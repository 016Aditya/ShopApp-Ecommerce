import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PATHS from "@/routes/paths";
import { formatCurrency } from "@/utils/currency";
import { useOrderStore } from "@/store/orderStore";
import OrderItemsList from "../components/OrderItemsList";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderSummary from "../components/OrderSummary";
import OrderTimeline from "../components/OrderTimeline";
import ReturnModal from "../components/ReturnModal";
import ShippingInfo from "../components/ShippingInfo";
import { useOrder, useCancelOrder } from "../hooks/useOrders";
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

const REFUND_LABELS = {
  PENDING:   "Pending",
  PROCESSED: "Processed",
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

const OrderDetailPage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { order, loading, error } = useOrder(id);
  const { returnStatus, requestReturn } = useReturn(id);

  // Cancel — now powered by TanStack Query via useCancelOrder
  const {
    cancelOrder:   cancelOrderAction,
    loading:       cancelling,
    error:         cancelError,
  } = useCancelOrder();
  const [cancelled, setCancelled] = useState(false);

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

  // ── Cancel ───────────────────────────────────────────────────────────────
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrderAction(id);
      setCancelled(true);
    } catch {
      // cancelError is surfaced via useCancelOrder().error and rendered below
    }
  };

  // ── Return ───────────────────────────────────────────────────────────────
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

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="orders-page"
        style={{ backgroundColor: "var(--bg-primary)", minHeight: "60vh" }}
      >
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
      <div
        className="orders-page"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)} aria-label="Back to Orders">
          ← Back to Orders
        </button>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="orders-page"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
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

  const returnBtnLabel = returnLoading
    ? "Processing…"
    : localReturnStatus
    ? "Return Requested"
    : "↩ Return Order";

  const returnRequestedOn = formatDate(order.returnRequestedAt);
  const returnCompletedOn = formatDate(order.returnCompletedAt);

  const displayStatus  = STATUS_LABELS[upperStatus] ?? currentStatus;
  const displayRefund  = order.refundStatus
    ? (REFUND_LABELS[order.refundStatus?.toUpperCase()] ?? order.refundStatus)
    : "Pending";

  return (
    <div className="orders-page order-detail-page">

      {/* Back */}
      <button
        className="orders-back"
        onClick={() => navigate(PATHS.ORDERS)}
        aria-label="Back to Orders"
      >
        ← Back to Orders
      </button>

      {/* Header */}
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

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <OrderStatusBadge status={currentStatus} />
          {isReturnFlow && returnRequestedOn && (
            <p className="order-detail__return-meta">
              Requested on {returnRequestedOn}
            </p>
          )}
        </div>
      </div>

      {/* Unified Timeline */}
      <div className="order-detail__timeline">
        <OrderTimeline
          status={localReturnStatus || currentStatus}
          isReturnFlow={isReturnFlow}
        />
      </div>

      {/* Content grid */}
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

          {/* Cancel error */}
          {cancelError && (
            <p className="error-text" style={{ marginTop: 8 }}>
              {cancelError}
            </p>
          )}

          {/* Return error */}
          {returnError && (
            <p className="error-text" style={{ marginTop: 8 }}>
              {returnError}
            </p>
          )}

          {/* Return success toast */}
          {returnSuccess && (
            <p className="success-text" style={{ marginTop: 8 }}>
              Return request submitted successfully.
            </p>
          )}

          {/* Action buttons */}
          <div className="order-detail__actions">
            {CANCELLABLE.has(upperStatus) && !cancelled && (
              <button
                className="btn btn-danger order-detail__cancel-btn"
                onClick={handleCancel}
                disabled={cancelDisabled}
              >
                {cancelling ? "Cancelling…" : "Cancel Order"}
              </button>
            )}

            {RETURNABLE.has(upperStatus) && !cancelled && !isReturnFlow && (
              <button
                className="btn btn-secondary order-detail__return-btn"
                onClick={() => setReturnModalOpen(true)}
                disabled={returnDisabled}
              >
                {returnBtnLabel}
              </button>
            )}

            {isReturnFlow && (
              <div className="order-detail__return-status">
                <span className="order-status-badge order-status-badge--return">
                  {STATUS_LABELS[localReturnStatus] ?? localReturnStatus}
                </span>
                {returnCompletedOn && (
                  <p className="order-detail__return-meta">
                    Completed on {returnCompletedOn}
                  </p>
                )}
                {order.refundStatus && (
                  <p className="order-detail__return-meta">
                    Refund: {displayRefund}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="order-detail__right">
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Order Summary</h3>
            <OrderSummary order={order} />
          </div>
        </div>
      </div>

      {/* Return Modal */}
      <ReturnModal
        open={returnModalOpen}
        onClose={() => setReturnModalOpen(false)}
        onConfirm={handleReturnRequest}
        loading={returnLoading}
      />
    </div>
  );
};

export default OrderDetailPage;
