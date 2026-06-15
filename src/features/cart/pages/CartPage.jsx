import { useNavigate } from "react-router-dom";
import useCart from "@/features/cart/hooks/useCart";
import PATHS from "@/routes/paths";
import CartItem from "@/features/cart/components/CartItem";
import OrderSummary from "@/features/cart/components/OrderSummary";

const CartPage = () => {
  const { items, cartTotal, loading, error, removeItem, updateItem, emptyCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate(PATHS.CHECKOUT);
  };

  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="space-y-4">
          <div className="h-32 rounded animate-pulse" style={{ background: "var(--bg-tertiary)" }} />
          <div className="h-32 rounded animate-pulse" style={{ background: "var(--bg-tertiary)" }} />
          <div className="h-32 rounded animate-pulse" style={{ background: "var(--bg-tertiary)" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-app py-8">
        <div
          className="rounded-lg p-6"
          style={{
            background: "var(--error-bg)",
            border: "1px solid var(--error-border)",
          }}
        >
          <p className="font-semibold" style={{ color: "var(--error-text)" }}>{error}</p>
          <button
            onClick={() => navigate(PATHS.HOME)}
            className="mt-4 font-medium"
            style={{ color: "var(--error-text)" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="container-app py-16">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <svg
              className="h-24 w-24"
              style={{ color: "var(--text-tertiary)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Your Cart is Empty</h2>
          <p className="mb-8" style={{ color: "var(--text-secondary)" }}>Add some products to get started shopping!</p>
          <button
            onClick={() => navigate(PATHS.PRODUCTS)}
            className="inline-block font-bold py-3 px-8 rounded-lg transition"
            style={{ background: "var(--button-primary)", color: "var(--button-primary-text)" }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="container-app py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Shopping Cart</h1>
          <p style={{ color: "var(--text-secondary)" }}>
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        {/* Main Layout: Items + Summary */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div
              className="rounded-lg shadow-sm overflow-hidden"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                className="px-6 py-4"
                style={{
                  borderBottom: "1px solid var(--border-color)",
                  background: "var(--bg-tertiary)",
                }}
              >
                <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Cart Items</h2>
              </div>

              <div style={{ borderColor: "var(--border-color)" }} className="divide-y">
                {items.map((item) => (
                  <div key={item.productId} className="px-6">
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateItem}
                      onRemove={removeItem}
                      onSaveForLater={() => {
                        console.log("Save for later:", item.productId);
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Continue Shopping Button */}
              <div
                className="px-6 py-4"
                style={{
                  background: "var(--bg-tertiary)",
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <button
                  onClick={() => navigate(PATHS.PRODUCTS)}
                  className="font-medium text-sm transition"
                  style={{ color: "var(--info-text)" }}
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              cartTotal={cartTotal}
              onCheckout={handleCheckout}
              onClearCart={emptyCart}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
