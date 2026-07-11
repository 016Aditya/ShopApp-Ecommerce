import { useState, useEffect }      from 'react';
import { useNavigate }              from 'react-router-dom';
import { useAuth }                  from '@/features/auth/hooks/useAuth';
import { useCartQuery, useClearCart } from '@/features/cart/hooks/useCart';
import { useQueryClient }           from '@tanstack/react-query';
import { queryKeys }                from '@/lib/queryKeys';
import { useAddresses }             from '@/features/address/hooks/useAddresses';
import CheckoutItems                from '../components/CheckoutItems';
import CheckoutAddress              from '../components/CheckoutAddress';
import OrderSummary                 from '../components/OrderSummary';
import SEO                          from '@/components/common/SEO';
import { useSEO }                   from '@/hooks/useSEO';
import { createOrder }              from '@/services/orderService';
import { cartKeys }                 from '@/features/cart/hooks/useCart';
import { toRequestBody }            from '@/features/address/utils/addressMapper';
import PATHS                        from '@/routes/paths';
import '../styles/Checkout.css';

const CheckoutPage = () => {
  const navigate                        = useNavigate();
  const { user }                        = useAuth();
  const { data: cart, isLoading }       = useCartQuery();
  const { mutateAsync: clearCartMutation } = useClearCart();
  const queryClient                     = useQueryClient();

  // Re-use the same TanStack Query cache entry that CheckoutAddress uses.
  // No double network request — both components share one cache key.
  const { data: addresses = [] } = useAddresses();

  const { seoProps } = useSEO({
    title:       'Checkout | Shop Fashion',
    description: 'Complete your purchase securely.',
    robots:      'noindex,nofollow',
  });

  const items     = cart?.items     ?? [];
  const cartTotal = cart?.cartTotal ?? 0;

  // selectedAddressId — the id string of the address the user chose.
  // Resolving the full address object happens just before placing the order.
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [placingOrder,      setPlacingOrder]       = useState(false);
  const [error,             setError]              = useState(null);

  useEffect(() => {
    if (!user) navigate(PATHS.LOGIN);
  }, [user, navigate]);

  // Callback passed to <CheckoutAddress onSelect={handleAddressSelect} />
  // Called with the address id string whenever the user picks a saved address
  // or when CheckoutAddress auto-selects the default one on first load.
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setError(null);
  };

  const handlePlaceOrder = async () => {
    // Resolve full address object from the cached list by id
    const fullAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

    if (!fullAddress)  { setError('Please select a delivery address.'); return; }
    if (!items.length) { setError('Your cart is empty.');                return; }

    setError(null);
    setPlacingOrder(true);

    try {
      // toRequestBody maps form-shape { name, phone, line1, ... }
      // -> backend AddressRequest { fullName, phoneNumber, addressLine1, ... }
      const shippingAddress = toRequestBody(fullAddress);

      const orderPromises = items.map((item) =>
        createOrder({
          userId:            user.id,
          productIds:        [item.productId],
          productQuantities: { [item.productId]: item.quantity },
          address:           shippingAddress,
        })
      );

      const orders    = await Promise.all(orderPromises);
      const lastOrder = orders[orders.length - 1];

      try {
        await clearCartMutation();
      } catch {
        queryClient.setQueryData(cartKeys.all(user.id), (old) =>
          old ? { ...old, items: [], cartTotal: 0 } : old
        );
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.byUser(user.id),
      });

      navigate(PATHS.ORDER_SUCCESS, { state: { order: lastOrder } });
    } catch (err) {
      setError(
        err.response?.data?.message ?? 'Failed to place order. Please try again.'
      );
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
          <button
            className="btn btn--primary"
            onClick={() => navigate(PATHS.PRODUCTS)}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="checkout-page">
      <SEO {...seoProps} />
      <h1 className="checkout-page__title">Checkout</h1>

      {error && (
        <div className="checkout-error" role="alert">
          {error}
        </div>
      )}

      <div className="checkout-layout">

        <div className="checkout-layout__main">
          <section className="checkout-section">
            <h2 className="checkout-section__title">📬 Delivery Address</h2>
            {/*
              CheckoutAddress contract:
                selectedAddressId {string|null} - the id currently selected
                onSelect          {function}    - called with address id on pick
            */}
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
            loading={placingOrder}
          />
        </div>

      </div>
    </main>
  );
};

export default CheckoutPage;
