import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PATHS, { buildPath } from "@/routes/paths";
import { formatCurrency } from "@/utils/currency";
import OrderStatusBadge from "./OrderStatusBadge";
import { ORDER_IMAGE_PLACEHOLDER } from "../utils/normalizeOrder";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(order.items?.[0]?.imageUrl ?? ORDER_IMAGE_PLACEHOLDER);

  const shortId = order.id?.slice(-8).toUpperCase() || "UNKNOWN";
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const summary = useMemo(() => {
    if (!order.items?.length) {
      return "Order details unavailable";
    }

    const [first, ...rest] = order.items;
    return rest.length > 0 ? `${first.productName} +${rest.length} more` : first.productName;
  }, [order.items]);

  return (
    <div className="order-card">
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

      <div className="order-card__body">
        <img
          src={imageSrc}
          alt={order.items?.[0]?.productName ?? "Ordered product"}
          className="order-card__img"
          loading="lazy"
          onError={() => setImageSrc(ORDER_IMAGE_PLACEHOLDER)}
        />

        <div className="order-card__info">
          <div className="order-card__status-row">
            <OrderStatusBadge status={order.status} />
            <span className="order-card__qty">
              {order.quantity} item{order.quantity !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="order-card__product-name">{summary}</p>
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
