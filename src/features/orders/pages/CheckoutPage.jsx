import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useCart from "@/features/cart/hooks/useCart";
import { usePlaceOrder } from "../hooks/useOrders";
import CheckoutAddress, { EMPTY_ADDRESS } from "../components/CheckoutAddress";
import CheckoutItems from "../components/CheckoutItems";
import OrderSummary from "../components/OrderSummary";
import PATHS from "@/routes/paths";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, cartTotal, emptyCart } = useCart();
  const { placeOrder, loading, error } = usePlaceOrder();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    ...EMPTY_ADDRESS,
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

  if (!user) {
    navigate(PATHS.LOGIN);
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <svg className="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some products before checking out.</p>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition"
            onClick={() => navigate(PATHS.PRODUCTS)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const isValid = () =>
    address.name.trim() &&
    address.phone.trim() &&
    address.line1.trim() &&
    address.zipCode.trim();

  const handlePlaceOrder = async () => {
    if (!isValid()) {
      alert("Please fill in all required address fields.");
      return;
    }

    const orderPayload = {
      userId: user.id,
      quantity: items.reduce((sum, item) => sum + item.quantity, 0),
      address,
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
    <div className="min-h-screen bg-gray-50">
      <div className="container-app py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <CheckoutAddress address={address} onChange={setAddress} />

            {/* Items Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white font-bold text-sm">
                    2
                  </span>
                  <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                </div>
              </div>
              <div className="p-6">
                <CheckoutItems items={items} />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}
          </div>

          {/* Order Summary - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
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
      </div>
    </div>
  );
};

export default CheckoutPage;
