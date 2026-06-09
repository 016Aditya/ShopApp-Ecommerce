import Button from "@/components/common/Button";
import PageLayout from "@/components/layout/PageLayout";
import EmptyState from "@/components/common/EmptyState";
import useCart from "@/features/cart/hooks/useCart";

function Checkout() {
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();

  if (!cartItems.length) {
    return (
      <PageLayout
        title="Checkout"
        description="Complete your purchase details."
      >
        <EmptyState
          title="Your cart is empty"
          description="Add products to your cart before proceeding to checkout."
        />
      </PageLayout>
    );
  }

  const shipping = totalItems > 0 ? 99 : 0;
  const tax = totalPrice * 0.18;
  const grandTotal = totalPrice + shipping + tax;

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    clearCart();
  };

  return (
    <PageLayout
      title="Checkout"
      description="Review your order and place it securely."
    >
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Shipping Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Full Name"
            />
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Phone Number"
            />
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-2"
              placeholder="Address"
            />
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="City"
            />
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              placeholder="Postal Code"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
              <div className="flex justify-between">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button className="mt-6" fullWidth onClick={handlePlaceOrder}>
            Place Order
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

export default Checkout;