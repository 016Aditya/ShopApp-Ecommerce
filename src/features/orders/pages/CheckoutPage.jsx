import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useCart from "@/features/cart/hooks/useCart";
import { usePlaceOrder } from "../hooks/useOrders";
import CheckoutAddress, { EMPTY_ADDRESS } from "../components/CheckoutAddress";
import CheckoutItems from "../components/CheckoutItems";
import OrderSummary from "../components/OrderSummary";
import { normalizeToStore } from "../hooks/useSavedAddresses";
import PATHS from "@/routes/paths";
import "../styles/Checkout.css";

const CheckoutPage = () => {
  const { user }                        = useAuth();
  const { items, cartTotal, emptyCart } = useCart();
  const { placeOrder, loading, error }  = usePlaceOrder();
  const navigate                        = useNavigate();

  const [address, setAddress] = useState({
    ...EMPTY_ADDRESS,
    name:    user?.name  ?? "",
    email:   user?.email ?? "",
    country: "India",
  });

  if (!user) {
    navigate(PATHS.LOGIN);
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page checkout-page--empty" style={{ minHeight: "100vh" }}>
        <div className="checkout-empty">
          <div className="checkout-empty__icon">🛒</div>
          <h2>Cart is Empty</h2>
          <p>Add some products before checking out.</p>
          <button
            className="checkout-empty__btn"
            onClick={() => navigate(PATHS.PRODUCTS)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // ── Validation ────────────────────────────────────────────────────────────
  const isValid = () =>
    address.name?.trim()    &&
    address.phone?.trim()   &&
    address.line1?.trim()   &&
    address.zipCode?.trim();

  // ── Place Order ───────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!isValid()) {
      alert("Please fill in all required address fields (Name, Phone, Address, Pincode).");
      return;
    }

    // normalizeToStore maps frontend keys → backend DTO keys
    const backendAddress = normalizeToStore(address);

    const orderPayload = {
      userId:     user.id,
      quantity:   items.reduce((sum, item) => sum + item.quantity, 0),
      address:    backendAddress,
      productIds: items.map((item) => item.productId),
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
        {/* Main Content */}
        <div className="checkout-page__main">
          {/* Address Section */}
          <CheckoutAddress address={address} onChange={setAddress} />

          {/* Items Section */}
          <div className="checkout-items">
            <div className="checkout-section__header">
              <span className="checkout-section__num">2</span>
              <h2 className="checkout-section__title">Order Items</h2>
            </div>
            <CheckoutItems items={items} />
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="rounded-lg p-4"
              style={{
                background: "var(--error-bg)",
                border: "1px solid var(--error-border)",
                color: "var(--error-text)",
              }}
            >
              <p className="font-semibold">{error}</p>
            </div>
          )}
        </div>

        {/* Order Summary — Sticky on Desktop */}
        <div className="checkout-page__aside">
          <OrderSummary
            items={items}
            cartTotal={cartTotal}
            loading={loading}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => navigate(PATHS.CART)}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
