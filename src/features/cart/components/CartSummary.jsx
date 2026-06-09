import { useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";
import { formatCurrency } from "@/utils/currency";
import PATHS from "@/routes/paths";

const CartSummary = () => {
  const { items, cartTotal, emptyCart } = useCart();
  const navigate = useNavigate();

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Order Summary</h2>

      <div className="cart-summary__row">
        <span>Items ({itemCount})</span>
        <span>{formatCurrency(cartTotal)}</span>
      </div>

      <div className="cart-summary__row cart-summary__total">
        <span>Total</span>
        <strong>{formatCurrency(cartTotal)}</strong>
      </div>

      <button
        className="btn btn--primary btn--full"
        onClick={() => navigate(PATHS.CHECKOUT)}
        disabled={items.length === 0}
      >
        Proceed to Checkout
      </button>

      <button
        className="btn btn--ghost btn--full"
        onClick={emptyCart}
        disabled={items.length === 0}
      >
        Clear Cart
      </button>
    </div>
  );
};

export default CartSummary;