import useCart from "../hooks/useCart";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import CartEmpty from "../components/CartEmpty";

const CartPage = () => {
  const { items, loading, error } = useCart();

  if (loading) return <p className="loading-text">Loading cart...</p>;
  if (error)   return <p className="error-text">{error}</p>;
  if (items.length === 0) return <CartEmpty />;

  return (
    <div className="page cart-page">
      <h1 className="page__title">Your Cart</h1>

      <div className="cart-page__layout">
        <div className="cart-page__items">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <aside className="cart-page__summary">
          <CartSummary />
        </aside>
      </div>
    </div>
  );
};

export default CartPage;