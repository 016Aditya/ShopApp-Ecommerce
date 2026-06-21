// src/features/orders/components/OrderReturnInfo.jsx
import "../styles/OrderReturnInfo.css";

/**
 * OrderReturnInfo
 *
 * Displays the return metadata panel inside OrderDetailPage.
 * Only renders when the order is in a return flow (has returnRequestedAt
 * or a return status).
 *
 * Fields shown (per spec):
 *   • Return Status      — e.g. RETURN_REQUESTED
 *   • Return Requested On — formatted date
 *   • Refund Status      — e.g. PENDING / PROCESSED
 *
 * Props:
 *   status             {string}       — current order status
 *   returnRequestedAt  {string|null}  — ISO date string or null
 *   returnCompletedAt  {string|null}  — ISO date string or null
 *   refundStatus       {string|null}  — "PENDING" | "PROCESSED" | null
 */

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

const formatDate = (isoString) => {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleDateString("en-IN", {
      day:   "2-digit",
      month: "short",
      year:  "numeric",
    });
  } catch {
    return isoString;
  }
};

const OrderReturnInfo = ({
  status,
  returnRequestedAt,
  returnCompletedAt,
  refundStatus,
}) => {
  const upperStatus = (status ?? "").toUpperCase();

  // Only render for orders in a return flow
  if (!RETURN_STATUSES.has(upperStatus)) return null;

  const statusLabel = STATUS_LABELS[upperStatus] ?? upperStatus;
  const refundLabel = REFUND_LABELS[refundStatus?.toUpperCase()] ?? (refundStatus || "Pending");
  const isSuccess   = upperStatus === "RETURN_SUCCESSFUL" || upperStatus === "REFUND_PROCESSED";

  return (
    <section className="order-return-info" aria-label="Return details">
      <h3 className="order-return-info__heading">Return Details</h3>

      <dl className="order-return-info__list">
        {/* Return Status */}
        <div className="order-return-info__row">
          <dt className="order-return-info__label">Return Status</dt>
          <dd className="order-return-info__value">
            <span
              className={[
                "order-return-info__badge",
                isSuccess
                  ? "order-return-info__badge--success"
                  : "order-return-info__badge--amber",
              ].join(" ")}
            >
              {statusLabel}
            </span>
          </dd>
        </div>

        {/* Return Requested On */}
        <div className="order-return-info__row">
          <dt className="order-return-info__label">Return Requested On</dt>
          <dd className="order-return-info__value">
            {formatDate(returnRequestedAt)}
          </dd>
        </div>

        {/* Return Completed On — only shown when available */}
        {returnCompletedAt && (
          <div className="order-return-info__row">
            <dt className="order-return-info__label">Return Completed On</dt>
            <dd className="order-return-info__value">
              {formatDate(returnCompletedAt)}
            </dd>
          </div>
        )}

        {/* Refund Status */}
        <div className="order-return-info__row">
          <dt className="order-return-info__label">Refund Status</dt>
          <dd className="order-return-info__value">
            <span
              className={[
                "order-return-info__badge",
                refundStatus?.toUpperCase() === "PROCESSED"
                  ? "order-return-info__badge--success"
                  : "order-return-info__badge--amber",
              ].join(" ")}
            >
              {refundLabel}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
};

export default OrderReturnInfo;
