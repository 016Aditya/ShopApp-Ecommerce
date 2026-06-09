import { useOrders } from "../hooks/useOrders";
import OrderCard from "../components/OrderCard";

const OrdersPage = () => {
  const { orders, loading, error } = useOrders();

  if (loading) return <p className="loading-text">Loading orders...</p>;
  if (error)   return <p className="error-text">{error}</p>;

  if (orders.length === 0) {
    return (
      <div className="page empty-state">
        <p>You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="page orders-page">
      <h1 className="page__title">My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;