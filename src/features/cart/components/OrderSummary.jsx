import { formatCurrency } from "@/utils/currency";
import { useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";

const OrderSummary = ({ items, cartTotal, onCheckout, onClearCart, loading }) => {
  const navigate = useNavigate();

  // Calculate metrics
  const itemsTotal = cartTotal;
  const shipping = 0; // Free shipping
  const shippingDisplay = shipping === 0 ? "FREE" : formatCurrency(shipping);
  const tax = Math.round(itemsTotal * 0.18 * 100) / 100; // 18% GST for India
  const discount = 0; // No discount by default
  const grandTotal = itemsTotal + shipping + tax - discount;

  return (
    <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-6 shadow-sm h-fit">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Summary Items */}
      <div className="space-y-4 border-b border-gray-200 pb-4">
        <div className="flex justify-between text-gray-700">
          <span>Items Total ({items.length} {items.length === 1 ? "item" : "items"})</span>
          <span className="font-semibold">{formatCurrency(itemsTotal)}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span className="font-semibold text-green-600">{shippingDisplay}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Tax (18%)</span>
          <span className="font-semibold">{formatCurrency(tax)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>Discount</span>
            <span className="font-semibold text-green-600">
              −{formatCurrency(discount)}
            </span>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div className="mt-4 border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold text-gray-900">Grand Total</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(grandTotal)}
          </span>
        </div>

        {/* CTA Buttons */}
        <button
          onClick={onCheckout}
          disabled={loading || items.length === 0}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition mb-3"
        >
          Proceed to Checkout
        </button>

        <button
          onClick={onClearCart}
          disabled={loading}
          className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 font-semibold py-3 rounded-lg transition"
        >
          Clear Cart
        </button>
      </div>

      {/* Trust Badge */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Secure Checkout
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
