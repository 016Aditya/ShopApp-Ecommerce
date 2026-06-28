import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PATHS from "@/routes/paths";
import { formatCurrency } from "@/utils/currency";
import OrderItemsList       from "../components/OrderItemsList";
import OrderStatusBadge     from "../components/OrderStatusBadge";
import OrderPricingSummary  from "../components/OrderPricingSummary";
import OrderTimeline        from "../components/OrderTimeline";
import ReturnModal          from "../components/ReturnModal";
import ShippingInfo         from "../components/ShippingInfo";
import { useOrder, useCancelOrder } from "../hooks/useOrders";
import { useReturn }        from "../hooks/useReturn";
import { ORDER_IMAGE_PLACEHOLDER } from "../utils/normalizeOrder";
import "../styles/Orders.css";

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

const REFUND_STATUS_LABELS = {
  PENDING:   "Pending",
  APPROVED:  "Approved",
  PROCESSED: "Processed",
  REJECTED:  "Rejected",
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

const OrderDetailPage = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { order, loading, error } = useOrder(id);

  const { returnStatus, requestReturn } = useReturn(id);

  const {
    cancelOrder:  cancelOrderAction,
    loading:      cancelling,
    error:        cancelError,
  } = useCancelOrder();
  const [cancelled, setCancelled]             = useState(false);
  const [localReturnStatus, setLocalReturnStatus] = useState(null);
  const [returnModalOpen,   setReturnModalOpen]   = useState(false);
  const [returnSuccess,     setReturnSuccess]     = useState(false);
  const [returnError,       setReturnError]       = useState(null);
  const [returnLoading,     setReturnLoading]     = useState(false);
  const [previewImgSrc,     setPreviewImgSrc]     = useState(ORDER_IMAGE_PLACEHOLDER);

  useEffect(() => { if (returnStatus) setLocalReturnStatus(returnStatus); }, [returnStatus]);
  useEffect(() => {
    if (order && RETURN_STATUSES.has(order.status?.toUpperCase())) {
      setLocalReturnStatus(order.status.toUpperCase());
    }
  }, [order]);
  useEffect(() => {
    const url = order?.items?.[0]?.imageUrl;
    if (url) setPreviewImgSrc(url);
  }, [order]);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await cancelOrderAction(id);
      setCancelled(true);
    } catch { /* cancelError surfaced below */ }
  };

  const handleReturnRequest = async () => {
    setReturnLoading(true);
    setReturnError(null);
    setLocalReturnStatus("RETURN_REQUESTED");
    setReturnModalOpen(false);
    try {
      await requestReturn();
      setReturnSuccess(true);
      setTimeout(() => setReturnSuccess(false), 5000);
    } catch (err) {
      setLocalReturnStatus(null);
      setReturnError(err.message || "Failed to initiate return. Please try again.");
    } finally {
      setReturnLoading(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="orders-page">
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)}>← Back to Orders</button>
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
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)}>← Back to Orders</button>
        <p className="error-text">{error}</p>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="orders-page">
        <button className="orders-back" onClick={() => navigate(PATHS.ORDERS)}>← Back to Orders</button>
        <div className="orders-empty"><h2>Order not found</h2></div>
      </div>
    );
  }

  // ── Derived state ─────────────────────────────────────────────────────
  const currentStatus = cancelled ? "CANCELLED" : order.status;
  const upperStatus   = currentStatus?.toUpperCase() ?? "PENDING";

  const cancelDisabled = !CANCELLABLE.has(upperStatus) || cancelled || cancelling;
  const returnDisabled = !RETURNABLE.has(upperStatus) || cancelled || !!localReturnStatus || returnLoading;
  const isReturnFlow   = !!localReturnStatus;

  const shortId  = order.id?.slice(-8).toUpperCase() || "UNKNOWN";
  const date     = formatDate(order.createdAt) ?? "N/A";

  const firstItem  = order.items?.[0];
  const extraCount = (order.items?.length ?? 0) - 1;
  const itemCount  = (order.items ?? []).reduce((n, i) => n + (i.quantity ?? 1), 0);

  const returnBtnLabel = returnLoading
    ? "Processing…"
    : localReturnStatus
    ? "Return Requested"
    : "↩ Return Order";

  const returnRequestedOn = formatDate(order.returnRequestedAt);
  const returnCompletedOn = formatDate(order.returnCompletedAt);
  const displayStatus     = STATUS_LABELS[upperStatus] ?? currentStatus;

  // Refund status: prefer server field; fall back to PENDING once return is initiated
  const rawRefundStatus  = order.refundStatus?.toUpperCase();
  const displayRefund    = rawRefundStatus
    ? (REFUND_STATUS_LABELS[rawRefundStatus] ?? order.refundStatus)
    : isReturnFlow
    ? "Pending"
    : null;

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
                width={48} height={48} loading="lazy"
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
            <p className="order-detail__return-meta">Requested on {returnRequestedOn}</p>
          )}
        </div>
      </div>

      {/* ── Timeline ── */}
      <div className="order-detail__timeline">
        <OrderTimeline
          status={localReturnStatus || currentStatus}
          isReturnFlow={isReturnFlow}
        />
      </div>

      {/* ── Grid ── */}
      <div className="order-detail__grid">

        {/* LEFT column */}
        <div className="order-detail__left">

          {/* Shipping Address */}
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">📍 Shipping Address</h3>
            <ShippingInfo address={order.address} />
          </div>

          {/* Products Ordered */}
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Products Ordered</h3>
            <OrderItemsList items={order.items} />
          </div>

          {/* Order Information — live from order object */}
          <div className="order-detail__section order-info-section">
            <h3 className="order-detail__section-title">Order Information</h3>
            <div className="order-info-grid">
              <div className="order-info-row">
                <span className="order-info-label">Status</span>
                <span className="order-info-value">
                  <OrderStatusBadge status={currentStatus} />
                </span>
              </div>
              <div className="order-info-row">
                <span className="order-info-label">Items</span>
                <span className="order-info-value">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
              </div>
              <div className="order-info-row">
                <span className="order-info-label">Order date</span>
                <span className="order-info-value">{date}</span>
              </div>
            </div>
          </div>

          {/* Return Information — only shown once return is initiated */}
          {isReturnFlow && (
            <div className="order-detail__section return-info-section">
              <h3 className="order-detail__section-title">Return Information</h3>
              <div className="order-info-grid">
                <div className="order-info-row">
                  <span className="order-info-label">Return Status</span>
                  <span
                    className="order-info-value order-info-value--return"
                    style={{ color: "var(--color-warning, #f97316)", fontWeight: 600 }}
                  >
                    {STATUS_LABELS[localReturnStatus] ?? localReturnStatus}
                  </span>
                </div>
                {returnRequestedOn && (
                  <div className="order-info-row">
                    <span className="order-info-label">Return Requested On</span>
                    <span className="order-info-value">{returnRequestedOn}</span>
                  </div>
                )}
                {returnCompletedOn && (
                  <div className="order-info-row">
                    <span className="order-info-label">Return Completed On</span>
                    <span className="order-info-value">{returnCompletedOn}</span>
                  </div>
                )}
                {displayRefund && (
                  <div className="order-info-row">
                    <span className="order-info-label">Refund Status</span>
                    <span
                      className="order-info-value"
                      style={{
                        color: displayRefund === "Processed" || displayRefund === "Approved"
                          ? "var(--color-success, #22c55e)"
                          : "var(--color-warning, #f97316)",
                        fontWeight: 600,
                      }}
                    >
                      {displayRefund}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Errors */}
          {cancelError && <p className="error-text" style={{ marginTop: 8 }}>{cancelError}</p>}
          {returnError  && <p className="error-text" style={{ marginTop: 8 }}>{returnError}</p>}
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
          </div>
        </div>

        {/* RIGHT column — Pricing Summary */}
        <div className="order-detail__right">
          <div className="order-detail__section">
            <h3 className="order-detail__section-title">Pricing Summary</h3>
            <OrderPricingSummary order={order} />
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
