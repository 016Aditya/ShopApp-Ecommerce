import { formatCurrency } from "@/utils/currency";

const OrderSummary = ({ items = [], cartTotal = 0 }) => {
  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Order Summary</h3>

      <ul className="order-summary__items">
        {items.map((item) => (
          <li key={item.productId} className="order-summary__item">
            <span>Product ID: {item.productId} × {item.quantity}</span>
            <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="order-summary__total">
        <strong>Total</strong>
        <strong>{formatCurrency(cartTotal)}</strong>
      </div>
    </div>
  );
};

export default OrderSummary;