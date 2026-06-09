import useCart from "../hooks/useCart";
import { formatCurrency, cartItemTotal } from "@/utils/currency";

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item__info">
        <p className="cart-item__product-id">Product ID: {item.productId}</p>
        <p className="cart-item__price">
          {formatCurrency(item.unitPrice)} × {item.quantity}
          <span className="cart-item__subtotal">
            = {formatCurrency(cartItemTotal(item))}
          </span>
        </p>
      </div>

      <div className="cart-item__controls">
        <button
          className="qty-btn"
          onClick={() => updateItem(item.productId, item.quantity - 1)}
          aria-label="Decrease quantity"
          disabled={item.quantity <= 1}
        >
          −
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          className="qty-btn"
          onClick={() => updateItem(item.productId, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>

        <button
          className="btn btn--ghost btn--sm cart-item__remove"
          onClick={() => removeItem(item.productId)}
          aria-label="Remove item"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;