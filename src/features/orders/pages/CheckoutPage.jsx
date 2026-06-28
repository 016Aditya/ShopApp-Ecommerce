import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '@/features/auth/hooks/useAuth';
import { useCartQuery }        from '@/features/cart/hooks/useCart';
import CheckoutItems           from '../components/CheckoutItems';
import CheckoutAddress         from '../components/CheckoutAddress';
import OrderSummary            from '../components/OrderSummary';
import { createOrder }         from '@/services/orderService';
import PATHS                   from '@/routes/paths';
import '../styles/Checkout.css';

const CheckoutPage = () => {
  const navigate                  = useNavigate();
  const { user }                  = useAuth();
  const { data: cart, isLoading } = useCartQuery();

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
      /**
       * FIX — `userId` was referenced as a bare variable but it was never
       * declared. The correct value lives on `user.id` (from useAuth).
       * Using `userId` (undefined) made the backend receive userId:null
       * so no order was created and the response was silently swallowed.
       *
       * Backend OrderController.createOrder() expects:
       *   { userId: string, productIds: string[], address: { street, city, state, zipCode, country } }
       */
      const payload = {
        userId: user.id,                          // ← was `userId` (undefined)
        productIds: items.map((i) => i.productId),
        address: {
          street:  selectedAddress.line1
                   + (selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''),
          city:    selectedAddress.city,
          state:   selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country || 'India',
        },
      };

      const order = await createOrder(payload);
      navigate(PATHS.ORDER_SUCCESS, { state: { order } });
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
