import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate }                from 'react-router-dom';
import { useAuth }                    from '@/features/auth/hooks/useAuth';
import { useCartQuery }               from '@/features/cart/hooks/useCart';
import { useAddresses }               from '@/features/address/hooks/useAddresses';
import { useCheckout }                from '../hooks/useCheckout';
import CheckoutItems                  from '../components/CheckoutItems';
import CheckoutAddress                from '../components/CheckoutAddress';
import OrderSummary                   from '../components/OrderSummary';
import SEO                            from '@/components/common/SEO';
import { useSEO }                     from '@/hooks/useSEO';
import PATHS                          from '@/routes/paths';
import '../styles/Checkout.css';

const CheckoutPage = () => {
  const navigate                          = useNavigate();
  const { user }                          = useAuth();
  const { data: cart, isLoading }         = useCartQuery();
  const { data: addresses = [] }          = useAddresses();
  const { placing, error, setError, placeOrder } = useCheckout();

  const items     = cart?.items     ?? [];
  const cartTotal = cart?.cartTotal ?? 0;
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const { seoProps } = useSEO({
    title: 'Checkout | Shop Fashion',
    description: 'Complete your purchase securely.',
    robots: 'noindex,nofollow',
  });

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => { if (!user) navigate(PATHS.LOGIN); }, [user, navigate]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setError(null);
  };

  const handlePlaceOrder = () => {
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;
    placeOrder({ user, items, selectedAddress });
  };

  // Block checkout if any item is out of stock
  const hasOutOfStockItems = items.some((item) => item.inStock === false);

  if (isLoading) return (
    <div className="checkout-page">
      <div className="checkout-loading">
        <div className="checkout-loading__spinner" />
        <p>Loading your cart…</p>
      </div>
    </div>
  );

  if (!items.length) return (
    <div className="checkout-page">
      <div className="checkout-empty">
        <p>Your cart is empty.</p>
        <button className="btn btn--primary" onClick={() => navigate(PATHS.PRODUCTS)}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <main className="checkout-page">
      <SEO {...seoProps} />
      <h1 className="checkout-page__title">Checkout</h1>

      {error && <div className="checkout-error" role="alert">{error}</div>}

      {hasOutOfStockItems && (
        <div className="checkout-error checkout-error--warning" role="alert">
          ⚠️ Some items in your cart are no longer available.
          Please remove them before proceeding.
        </div>
      )}

      <div className="checkout-layout">
        <div className="checkout-layout__main">
          <section className="checkout-section">
            <h2 className="checkout-section__title">📬 Delivery Address</h2>
            <CheckoutAddress
              selectedAddressId={selectedAddressId}
              onSelect={handleAddressSelect}
            />
          </section>
          <section className="checkout-section">
            <h2 className="checkout-section__title">
              🛒 Order Items ({items.length})
            </h2>
            <CheckoutItems items={items} />
          </section>
        </div>
        <div className="checkout-layout__sidebar">
          <OrderSummary
            items={items}
            cartTotal={cartTotal}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => navigate(PATHS.CART)}
            loading={placing}
            disabled={placing || hasOutOfStockItems}
          />
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
