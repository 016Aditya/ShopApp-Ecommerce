import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import useCart from "@/features/cart/hooks/useCart";
import { usePlaceOrder } from "../hooks/useOrders";
import AddressForm from "../components/AddressForm";
import OrderSummary from "../components/OrderSummary";
import PATHS from "@/routes/paths";

const EMPTY_ADDRESS = { line1: "", city: "", state: "", zipCode: "", country: "" };

const CheckoutPage = () => {
  const { user }                    = useContext(AuthContext);
  const { items, cartTotal, emptyCart } = useCart();
  const { placeOrder, loading, error }  = usePlaceOrder();
  const navigate                    = useNavigate();

  const [address, setAddress] = useState(EMPTY_ADDRESS);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      userId:     user.id,
      quantity:   items.reduce((sum, i) => sum + i.quantity, 0),
      address,
      productIds: items.map((i) => i.productId),
    };

    try {
      const order = await placeOrder(orderData);
      await emptyCart();                              // clear cart after order
      navigate(buildPath(PATHS.ORDER_DETAIL, order.id));
    } catch {
      // error already set in usePlaceOrder
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <p>Your cart is empty. <a href={PATHS.PRODUCTS}>Browse products</a></p>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <h1 className="page__title">Checkout</h1>

      <div className="checkout-page__layout">
        <form className="checkout-page__form" onSubmit={handleSubmit}>
          <AddressForm address={address} onChange={setAddress} />

          {error && <p className="error-text">{error}</p>}

          <button
            type="submit"
            className="btn btn--primary btn--full"
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <aside className="checkout-page__summary">
          <OrderSummary items={items} cartTotal={cartTotal} />
        </aside>
      </div>
    </div>
  );
};

// missing import — add this at the top
import { buildPath } from "@/routes/paths";

export default CheckoutPage;