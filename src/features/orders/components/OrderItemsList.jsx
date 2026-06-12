import { formatCurrency } from "@/utils/currency";

const PLACEHOLDER = "https://placehold.co/72x72/f3f4f6/9ca3af?text=Item";

const OrderItemsList = ({ items = [] }) => {
  if (items.length === 0)
    return <p className="text-muted">No items found.</p>;

  return (
    <ul className="order-items-list">
      {items.map((item, i) => (
        <li key={item.productId ?? i} className="order-items-list__row">
          <img
            src={item.imageUrl ?? PLACEHOLDER}
            alt={item.productName ?? "Product"}
            className="order-items-list__img"
            loading="lazy"
          />
          <div className="order-items-list__meta">
            <p className="order-items-list__name">
              {item.productName ?? item.productId}
            </p>
            <p className="order-items-list__qty">Qty: {item.quantity}</p>
          </div>
          <span className="order-items-list__price">
            {formatCurrency((item.unitPrice ?? 0) * item.quantity)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default OrderItemsList;
