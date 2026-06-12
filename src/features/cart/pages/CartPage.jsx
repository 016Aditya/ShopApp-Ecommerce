import { useNavigate } from "react-router-dom";
import useCart from "@/features/cart/hooks/useCart";
import { formatCurrency } from "@/utils/currency";
import PATHS from "@/routes/paths";

const CartPage = () => {
  const { items, cartTotal, loading, error, updateItem, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="page cart-page">
        <div className="skeleton skeleton-heading" />
        <div className="skeleton skeleton-text" />
      </div>
    );
  }

  if (error) {
    return <div className="page cart-page"><p className="error-text" role="alert">{error}</p></div>;
  }

  if (!items || items.length === 0) {
    return (
      <div className="page cart-page">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started.</p>
          <button className="btn btn--primary" onClick={() => navigate(PATHS.PRODUCTS)}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <h1 className="page__title">Your Cart</h1>
      <div className="cart-page__layout">
        <ul className="cart-items" role="list">
          {items.map((item) => (
            <li key={item.productId} className="cart-item">
              <div className="cart-item__info">
                <p className="cart-item__name">{item.productName ?? item.productId}</p>
                <p className="cart-item__price">{formatCurrency(item.price)}</p>
              </div>
              <div className="cart-item__controls">
                <button className="btn btn--ghost btn--sm" onClick={() => updateItem(item.productId, item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Decrease quantity">−</button>
                <span className="cart-item__qty">{item.quantity}</span>
                <button className="btn btn--ghost btn--sm" onClick={() => updateItem(item.productId, item.quantity + 1)} aria-label="Increase quantity">+</button>
              </div>
              <p className="cart-item__subtotal">{formatCurrency(item.price * item.quantity)}</p>
              <button className="btn btn--danger btn--sm" onClick={() => removeItem(item.productId)} aria-label={`Remove ${item.productName ?? item.productId}`}>Remove</button>
            </li>
          ))}
        </ul>
        <aside className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>
          <p className="cart-summary__total">Total: <strong>{formatCurrency(cartTotal)}</strong></p>
          <button className="btn btn--primary btn--full" onClick={() => navigate(PATHS.CHECKOUT)}>Proceed to Checkout</button>
          <button className="btn btn--ghost btn--full" onClick={emptyCart}>Clear Cart</button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;