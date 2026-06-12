import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useCart from "@/features/cart/hooks/useCart";
import { usePlaceOrder } from "../hooks/useOrders";
import CheckoutAddress, { EMPTY_ADDRESS } from "../components/CheckoutAddress";
import CheckoutItems from "../components/CheckoutItems";
import OrderSummary from "../components/OrderSummary";
import PATHS from "@/routes/paths";
import "../styles/Checkout.css";

const CheckoutPage = () => {
  const { user }                        = useAuth();
  const { items, cartTotal, emptyCart } = useCart();
  const { placeOrder, loading, error }  = usePlaceOrder();
  const navigate                        = useNavigate();

  const [address, setAddress] = useState({
    ...EMPTY_ADDRESS,
    name:  user?.name  ?? "",
    email: user?.email ?? "",
  });

  /* ── Auth guard ───────────────────────────────────────── */
  if (!user) {
    navigate(PATHS.LOGIN);
    return null;
  }

  /* ── Empty cart ───────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="checkout-page checkout-page--empty">
        <div className="checkout-empty">
          <span className="checkout-empty__icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Add some products before checking out.</p>
          <button
            className="btn checkout-empty__btn"
            onClick={() => navigate(PATHS.PRODUCTS)}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  /* ── Validation ───────────────────────────────────────── */
  const isValid = () =>
    address.name.trim() &&
    address.phone.trim() &&
    address.line1.trim() &&
    address.zipCode.trim();

  /* ── Place order ──────────────────────────────────────── */
  const handlePlaceOrder = async () => {
    if (!isValid()) {
      alert("Please fill in all required address fields.");
      return;
    }
    const orderPayload = {
      userId:     user.id,
      quantity:   items.reduce((s, i) => s + i.quantity, 0),
      address,
      productIds: items.map((i) => i.productId),
      // JWT-ready: token will be injected via axios interceptor
    };
    try {
      await placeOrder(orderPayload);
      await emptyCart();
      navigate(PATHS.ORDER_SUCCESS);
    } catch {
      // error shown via `error` from usePlaceOrder
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>

      <div className="checkout-page__grid">
        {/* LEFT + MIDDLE */}
        <div className="checkout-page__main">
          <CheckoutAddress address={address} onChange={setAddress} />
          <CheckoutItems items={items} />
          {error && <p className="error-text checkout-error">{error}</p>}
        </div>

        {/* RIGHT — sticky summary */}
        <aside className="checkout-page__aside">
          <OrderSummary
            items={items}
            cartTotal={cartTotal}
            loading={loading}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => navigate(PATHS.CART)}
          />
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
