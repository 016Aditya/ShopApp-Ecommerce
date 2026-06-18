import { useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";
import OrderCard from "../components/OrderCard";
import { useOrders } from "../hooks/useOrders";
import "../styles/Orders.css";

const OrderSkeleton = () => (
  <div className="order-skeleton">
    {[1, 2, 3].map((item) => (
      <div key={item} className="order-skeleton__card skeleton" />
    ))}
  </div>
);

const OrdersPage = () => {
  const { orders, loading, error, fetchOrders } = useOrders();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="orders-page">
        <h1 className="orders-page__title">My Orders</h1>
        <OrderSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <h1 className="orders-page__title">My Orders</h1>
        <div className="orders-error">
          <span>Unable to load orders.</span>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={fetchOrders}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <h1 className="orders-page__title">My Orders</h1>
        <div className="orders-empty">
          <span className="orders-empty__icon">📦</span>
          <h2>No orders yet</h2>
          <p>You have not placed any orders yet.</p>
          <button className="btn orders-empty__btn" onClick={() => navigate(PATHS.PRODUCTS)}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1 className="orders-page__title">My Orders</h1>
      <p className="orders-page__count">
        {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>
      <div className="orders-list">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
