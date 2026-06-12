import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";
import "../styles/Orders.css";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  // Auto-redirect to orders after 5 s
  useEffect(() => {
    const t = setTimeout(() => navigate(PATHS.ORDERS), 5000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="order-success-page">
      <div className="order-success">
        <div className="order-success__animation">
          <div className="order-success__circle">
            <span className="order-success__check">✓</span>
          </div>
        </div>
        <h1 className="order-success__title">Order Placed Successfully!</h1>
        <p className="order-success__subtitle">
          Thank you for your purchase. You&apos;ll receive a confirmation shortly.
        </p>
        <p className="order-success__redirect">
          Redirecting to your orders in 5 seconds…
        </p>
        <div className="order-success__actions">
          <button
            className="btn order-success__btn order-success__btn--orders"
            onClick={() => navigate(PATHS.ORDERS)}
          >
            View My Orders
          </button>
          <button
            className="btn order-success__btn order-success__btn--shop"
            onClick={() => navigate(PATHS.PRODUCTS)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
