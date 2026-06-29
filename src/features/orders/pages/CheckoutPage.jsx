import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '@/features/auth/hooks/useAuth';
import { useCartQuery, useClearCart } from '@/features/cart/hooks/useCart';
import { useQueryClient }      from '@tanstack/react-query';
import { queryKeys }           from '@/lib/queryKeys';
import CheckoutItems           from '../components/CheckoutItems';
import CheckoutAddress         from '../components/CheckoutAddress';
import OrderSummary            from '../components/OrderSummary';
import { createOrder }         from '@/services/orderService';
import { cartKeys }            from '@/features/cart/hooks/useCart';
import PATHS                   from '@/routes/paths';
import '../styles/Checkout.css';

const CheckoutPage = () => {
  const navigate                  = useNavigate();
  const { user }                  = useAuth();
  const { data: cart, isLoading } = useCartQuery();
  const { mutateAsync: clearCartMutation } = useClearCart();
  const queryClient               = useQueryClient();

  const items     = cart?.items     ?? [];
  const cartTotal = cart?.cartTotal ?? 0;

  const [selectedAddress, setSelectedAddress] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '',
    city: '', state: '',
    zipCode: '', country: 'India',
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error,        setError]        = useState(null);

  useEffect(() => {
    if (!user) navigate(PATHS.LOGIN);
  }, [user, navigate]);

  const handlePlaceOrder = async () => {
    const hasAddress = selectedAddress?.line1?.trim() && selectedAddress?.city?.trim();
    if (!hasAddress)   { setError('Please enter a delivery address.'); return; }
    if (!items.length) { setError('Your cart is empty.');               return; }

    setError(null);
    setPlacingOrder(true);

    try {
      const shippingAddress = {
        street:  selectedAddress.line1
                 + (selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''),
        city:    selectedAddress.city,
        state:   selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        country: selectedAddress.country || 'India',
      };

      // FIX BUG 2: Create ONE separate order per distinct cart item
      //   Samsung + iPhone in cart  →  2 orders (not 1)
      // FIX BUG 1: Send actual cart quantity per product
      //   3x Jeans in cart  →  1 order with qty=3 (not "1 item")
      const orderPromises = items.map((item) =>
        createOrder({
          userId:     user.id,
          productIds: [item.productId],
          productQuantities: { [item.productId]: item.quantity },
          address: shippingAddress,
        })
      );

      const orders = await Promise.all(orderPromises);
      const lastOrder = orders[orders.length - 1];

      // Clear the cart on the backend and wipe TQ cart cache
      // so the cart badge and drawer show 0 items immediately.
      try {
        await clearCartMutation();
      } catch {
        // Cart clear failure should NOT block order success navigation.
        // Manually wipe TQ cache so UI is still consistent.
        queryClient.setQueryData(cartKeys.all(user.id), (old) =>
          old ? { ...old, items: [], cartTotal: 0 } : old
        );
      }

      // Invalidate the orders list cache so OrdersPage shows all new
      // orders immediately without requiring a manual refresh.
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.byUser(user.id),
      });

      navigate(PATHS.ORDER_SUCCESS, { state: { order: lastOrder } });
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="checkout-page">
        <div className="checkout-loading">
          <div className="checkout-loading__spinner" />
          <p>Loading your cart…</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <p>Your cart is empty.</p>
          <button className="btn btn--primary" onClick={() => navigate(PATHS.PRODUCTS)}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>

      {error && <div className="checkout-error" role="alert">{error}</div>}

      <div className="checkout-layout">

        {/* ── Left column ── */}
        <div className="checkout-layout__main">
          <section className="checkout-section">
            <h2 className="checkout-section__title">📬 Delivery Address</h2>
            <CheckoutAddress
              address={selectedAddress}
              onChange={setSelectedAddress}
            />
          </section>

          <section className="checkout-section">
            <h2 className="checkout-section__title">🛒 Order Items ({items.length})</h2>
            <CheckoutItems items={items} />
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="checkout-layout__sidebar">
          <OrderSummary
            items={items}
            cartTotal={cartTotal}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => navigate(PATHS.CART)}
            loading={placingOrder}
          />
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
