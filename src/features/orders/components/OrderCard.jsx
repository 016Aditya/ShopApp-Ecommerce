import { useNavigate } from "react-router-dom";
import { buildPath } from "@/routes/paths";
import PATHS from "@/routes/paths";
import { formatCurrency } from "@/utils/currency";
import OrderStatusBadge from "./OrderStatusBadge";

const PLACEHOLDER = "https://placehold.co/72x72/f3f4f6/9ca3af?text=Item";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const shortId  = order.id?.slice(-8).toUpperCase();
  const date     = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "—";

  const firstImg = order.items?.[0]?.imageUrl ?? PLACEHOLDER;

  return (
    <div className="order-card">
      <div className="order-card__header">
        <div className="order-card__header-left">
          <span className="order-card__label">ORDER PLACED</span>
          <span className="order-card__value">{date}</span>
        </div>
        <div className="order-card__header-mid">
          <span className="order-card__label">TOTAL</span>
          <span className="order-card__value">{formatCurrency(order.totalPrice)}</span>
        </div>
        <div className="order-card__header-right">
          <span className="order-card__id">Order # {shortId}</span>
        </div>
      </div>

      <div className="order-card__body">
        <img
          src={firstImg}
          alt="Order item"
          className="order-card__img"
          loading="lazy"
        />
        <div className="order-card__info">
          <div className="order-card__status-row">
            <OrderStatusBadge status={order.status} />
            {order.quantity && (
              <span className="order-card__qty">
                {order.quantity} item{order.quantity !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {order.items?.[0]?.productName && (
            <p className="order-card__product-name">
              {order.items[0].productName}
            </p>
          )}
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
