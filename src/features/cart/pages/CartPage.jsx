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
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-app py-8">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6">
          <p className="text-red-700 font-semibold">{error}</p>
          <button
            onClick={() => navigate(PATHS.HOME)}
            className="mt-4 text-red-600 hover:text-red-700 font-medium"
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
            <svg className="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started shopping!</p>
          <button
            onClick={() => navigate(PATHS.PRODUCTS)}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-app py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        {/* Main Layout: Items + Summary */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-bold text-gray-900">Cart Items</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.productId} className="px-6">
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateItem}
                      onRemove={removeItem}
                      onSaveForLater={() => {
                        // TODO: Implement save for later functionality
                        console.log("Save for later:", item.productId);
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Continue Shopping Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => navigate(PATHS.PRODUCTS)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
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
