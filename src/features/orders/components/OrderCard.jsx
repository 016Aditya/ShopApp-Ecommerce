import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PATHS, { buildPath } from "@/routes/paths";
import { formatCurrency } from "@/utils/currency";
import OrderStatusBadge from "./OrderStatusBadge";
import { ORDER_IMAGE_PLACEHOLDER } from "../utils/normalizeOrder";

/**
 * OrderCard
 *
 * Collapsed order row shown on My Orders page.
 *
 * Collapsed view shows:
 *   [Product Image]  Status badge  Product Name  Qty  | View Details
 *
 * Image comes from the first normalized item (order.items[0].imageUrl).
 * Product name comes from the first normalized item (order.items[0].productName).
 * Both fields are guaranteed by normalizeOrder — no guessing here.
 */
const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const firstItem = order.items?.[0];
  const [imageSrc, setImageSrc] = useState(
    firstItem?.imageUrl ?? ORDER_IMAGE_PLACEHOLDER
  );

  const shortId = order.id?.slice(-8).toUpperCase() || "UNKNOWN";

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "N/A";

  // Product name line: "iPhone 17 Pro Max +2 more" or just the name
  const productSummary = useMemo(() => {
    if (!order.items?.length) {
      return order.quantity > 0
        ? `${order.quantity} item${order.quantity !== 1 ? "s" : ""}`
        : "View order details →";
    }
    const [first, ...rest] = order.items;
    return rest.length > 0
      ? `${first.productName} +${rest.length} more`
      : first.productName;
  }, [order.items, order.quantity]);

  const qtyLabel = order.quantity > 0
    ? `${order.quantity} item${order.quantity !== 1 ? "s" : ""}`
    : firstItem
      ? `${firstItem.quantity} item${firstItem.quantity !== 1 ? "s" : ""}`
      : "";

  return (
    <div className="order-card">
      {/* ── Header row ── */}
      <div className="order-card__header">
        <div className="order-card__header-left">
          <span className="order-card__label">Order placed</span>
          <span className="order-card__value">{date}</span>
        </div>
        <div className="order-card__header-mid">
          <span className="order-card__label">Total</span>
          <span className="order-card__value">{formatCurrency(order.totalPrice)}</span>
        </div>
        <div className="order-card__header-right">
          <span className="order-card__id">Order #{shortId}</span>
        </div>
      </div>

      {/* ── Body row ── */}
      <div className="order-card__body">
        {/* Product thumbnail */}
        <img
          src={imageSrc}
          alt={firstItem?.productName ?? "Ordered product"}
          className="order-card__img"
          loading="lazy"
          onError={() => setImageSrc(ORDER_IMAGE_PLACEHOLDER)}
        />

        <div className="order-card__info">
          <div className="order-card__status-row">
            <OrderStatusBadge status={order.status} />
            {qtyLabel && (
              <span className="order-card__qty">{qtyLabel}</span>
            )}
          </div>
          {/* Product name — comes from normalized items */}
          <p className="order-card__product-name">{productSummary}</p>
        </div>

        <div className="order-card__actions">
          <button
            className="btn order-card__btn order-card__btn--detail"
            onClick={() => navigate(buildPath(PATHS.ORDER_DETAIL, order.id))}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
