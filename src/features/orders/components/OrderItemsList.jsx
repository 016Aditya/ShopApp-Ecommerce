import { useState } from "react";
import { formatCurrency } from "@/utils/currency";
import { ORDER_IMAGE_PLACEHOLDER } from "../utils/normalizeOrder";

/**
 * OrderItemsList
 *
 * Renders the "Products Ordered" section inside OrderDetailPage.
 * Receives items already normalized by normalizeOrder — all fields
 * are guaranteed (productName, imageUrl, quantity, unitPrice, totalPrice).
 */
const OrderItemsList = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="order-items-empty">
        <p className="text-muted">No items to display for this order.</p>
      </div>
    );
  }

  return (
    <ul className="order-items-list">
      {items.map((item, index) => (
        <OrderItemRow
          key={item.id ?? item.productId ?? index}
          item={item}
        />
      ))}
    </ul>
  );
};

function OrderItemRow({ item }) {
  const [imageSrc, setImageSrc] = useState(
    item.imageUrl || ORDER_IMAGE_PLACEHOLDER
  );

  // All these fields come from normalizeOrderItem — guaranteed present
  const productName = item.productName || "Product";
  const quantity    = item.quantity    || 1;
  const unitPrice   = item.unitPrice   || 0;
  const totalPrice  = item.totalPrice  || unitPrice * quantity;

  return (
    <li className="order-items-list__row">
      {/* Product image */}
      <img
        src={imageSrc}
        alt={productName}
        className="order-items-list__img"
        loading="lazy"
        onError={() => setImageSrc(ORDER_IMAGE_PLACEHOLDER)}
      />

      {/* Product meta */}
      <div className="order-items-list__meta">
        <p className="order-items-list__name">{productName}</p>
        <p className="order-items-list__qty">Qty: {quantity}</p>
        {unitPrice > 0 && (
          <p className="order-items-list__unit-price">
            {formatCurrency(unitPrice)} each
          </p>
        )}
      </div>

      {/* Line total */}
      <div className="order-items-list__pricing">
        <span className="order-items-list__price">
          {formatCurrency(totalPrice)}
        </span>
      </div>
    </li>
  );
}

export default OrderItemsList;
