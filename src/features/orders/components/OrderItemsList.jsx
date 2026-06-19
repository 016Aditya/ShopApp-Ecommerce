import { useState } from "react";
import { formatCurrency } from "@/utils/currency";
import { ORDER_IMAGE_PLACEHOLDER } from "../utils/normalizeOrder";

const OrderItemsList = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="order-items-empty">
        <p className="text-muted">
          No items to display for this order.
        </p>
      </div>
    );
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

  const productName = item.productName || item.name || "Product";
  const quantity = item.quantity || 1;
  const totalPrice = item.totalPrice || item.unitPrice || 0;

  return (
    <li className="order-items-list__row">
      <img
        src={imageSrc}
        alt={productName}
        className="order-items-list__img"
        loading="lazy"
        onError={() => setImageSrc(ORDER_IMAGE_PLACEHOLDER)}
      />
      <div className="order-items-list__meta">
        <p className="order-items-list__name">{productName}</p>
        <p className="order-items-list__qty">Qty: {quantity}</p>
        <p className="order-items-list__unit-price">
          ₹{(item.unitPrice || 0).toFixed(2)} each
        </p>
      </div>
      <div className="order-items-list__pricing">
        <span className="order-items-list__price">{formatCurrency(totalPrice)}</span>
      </div>
    </li>
  );
}

export default OrderItemsList;
