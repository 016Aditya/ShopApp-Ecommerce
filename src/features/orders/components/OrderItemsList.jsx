import { useState } from "react";
import { formatCurrency } from "@/utils/currency";
import { ORDER_IMAGE_PLACEHOLDER } from "../utils/normalizeOrder";

const OrderItemsList = ({ items = [] }) => {
  if (items.length === 0) {
    return <p className="text-muted">No items found.</p>;
  }

  return (
    <ul className="order-items-list">
      {items.map((item, index) => (
        <OrderItemRow key={item.id ?? item.productId ?? index} item={item} />
      ))}
    </ul>
  );
};

function OrderItemRow({ item }) {
  const [imageSrc, setImageSrc] = useState(item.imageUrl || ORDER_IMAGE_PLACEHOLDER);

  return (
    <li className="order-items-list__row">
      <img
        src={imageSrc}
        alt={item.productName || "Product"}
        className="order-items-list__img"
        loading="lazy"
        onError={() => setImageSrc(ORDER_IMAGE_PLACEHOLDER)}
      />
      <div className="order-items-list__meta">
        <p className="order-items-list__name">{item.productName || "Product"}</p>
        <p className="order-items-list__qty">Qty: {item.quantity}</p>
      </div>
      <span className="order-items-list__price">{formatCurrency(item.totalPrice)}</span>
    </li>
  );
}

export default OrderItemsList;
