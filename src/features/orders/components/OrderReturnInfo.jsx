import "../styles/OrderReturnInfo.css";

/**
 * OrderReturnInfo
 *
 * NEW isolated component for the "Return Information" panel shown in
 * OrderDetailPage when an order is in the return flow.
 *
 * Props:
 *   status             — current return status string (e.g. "RETURN_REQUESTED")
 *   returnRequestedAt  — ISO date string | null
 *   returnCompletedAt  — ISO date string | null
 *   refundStatus       — "PENDING" | "PROCESSED" | null
 *
 * Old orders without these fields pass null safely — fields simply don't render.
 */

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

const REFUND_STATUS_LABEL = {
  PENDING:   { label: "Pending",   cls: "return-info__refund--pending"   },
  PROCESSED: { label: "Processed", cls: "return-info__refund--processed" },
};

const OrderReturnInfo = ({
  status,
  returnRequestedAt,
  returnCompletedAt,
  refundStatus,
}) => {
  const requestedOn  = formatDate(returnRequestedAt);
  const completedOn  = formatDate(returnCompletedAt);
  const refundMeta   = REFUND_STATUS_LABEL[(refundStatus ?? "").toUpperCase()];
  const refundLabel  = refundMeta?.label ?? refundStatus ?? "Pending";
  const refundCls    = refundMeta?.cls   ?? "return-info__refund--pending";

  return (
    <section className="return-info" aria-label="Return information">
      <h3 className="return-info__title">Return Information</h3>

      <dl className="return-info__list">
        {/* Return Status */}
        <div className="return-info__row">
          <dt className="return-info__label">Return Status</dt>
          <dd className="return-info__value return-info__value--status">
            {status
              ? status
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              : "—"}
          </dd>
        </div>

        {/* Return Requested On */}
        {requestedOn && (
          <div className="return-info__row">
            <dt className="return-info__label">Return Requested On</dt>
            <dd className="return-info__value">{requestedOn}</dd>
          </div>
        )}

        {/* Return Completed On */}
        {completedOn && (
          <div className="return-info__row">
            <dt className="return-info__label">Return Completed On</dt>
            <dd className="return-info__value">{completedOn}</dd>
          </div>
        )}

        {/* Refund Status */}
        <div className="return-info__row">
          <dt className="return-info__label">Refund Status</dt>
          <dd className={`return-info__value ${refundCls}`}>{refundLabel}</dd>
        </div>
      </dl>
    </section>
  );
};

export default OrderReturnInfo;
