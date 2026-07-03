import { useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";
import OrderCard from "../components/OrderCard";
import SEO from "@/components/common/SEO";
import { useSEO } from "@/hooks/useSEO";
import { useOrders } from "../hooks/useOrders";
import { OrderCardSkeleton } from "@/components/skeleton";
import "../styles/Orders.css";

const OrdersPage = () => {
  const { orders, loading, error, fetchOrders } = useOrders();
  const navigate = useNavigate();

  const { seoProps } = useSEO({
    title: 'My Orders | Shop Fashion',
    description: 'View your order history and track your deliveries.',
    robots: 'noindex,nofollow',
  });

  if (loading) {
    return (
      <section className="orders-page">
        <SEO {...seoProps} />
        <div className="sk mb-4" style={{ height: 24, width: 130 }} />
        <div className="sk mb-6" style={{ height: 14, width: 80 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="orders-page">
        <SEO {...seoProps} />
        <h1 className="orders-page__title">My Orders</h1>
        <div className="orders-error">
          <span>Unable to load orders.</span>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={fetchOrders}>Retry</button>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="orders-page">
        <SEO {...seoProps} />
        <h1 className="orders-page__title">My Orders</h1>
        <div className="orders-empty">
          <span className="orders-empty__icon">📦</span>
          <h2>No orders yet</h2>
          <p>You have not placed any orders yet.</p>
          <button className="btn orders-empty__btn" onClick={() => navigate(PATHS.PRODUCTS)}>
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="orders-page sk-loaded">
      <SEO {...seoProps} />
      <h1 className="orders-page__title">My Orders</h1>
      <p className="orders-page__count">
        {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>
      <div className="orders-list">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
};

export default OrdersPage;
