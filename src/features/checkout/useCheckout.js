import { useState }       from 'react';
import { useNavigate }    from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useClearCart, cartKeys } from '@/features/cart/hooks/useCart';
import { useCartSync }    from '@/features/cart/hooks/useCartSync';
import { queryKeys }      from '@/lib/queryKeys';
import { submitCheckout } from '../services/checkoutService';
import { toRequestBody }  from '@/features/address/utils/addressMapper';
import { toast }          from '@/lib/toast';
import PATHS               from '@/routes/paths';

export const useCheckout = () => {
  const navigate                           = useNavigate();
  const queryClient                        = useQueryClient();
  const { mutateAsync: clearCartMutation } = useClearCart();
  const { syncAfterConflict }              = useCartSync();

  const [placing, setPlacing] = useState(false);
  const [error,   setError]   = useState(null);

  const placeOrder = async ({ user, items, selectedAddress }) => {
    if (placing) return;

    if (!selectedAddress) { setError('Please select a delivery address.'); return; }
    if (!items?.length)   { setError('Your cart is empty.'); return; }

    setError(null);
    setPlacing(true);

    try {
      const address = toRequestBody(selectedAddress);
      const order   = await submitCheckout({ userId: user.id, items, address });

      try { await clearCartMutation(); }
      catch {
        queryClient.setQueryData(cartKeys.all(user.id), (old) =>
          old ? { ...old, items: [], cartTotal: 0 } : old);
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.orders.byUser(user.id) });
      navigate(PATHS.ORDER_SUCCESS, { state: { order } });

    } catch (err) {
      const data = err?.response?.data;

      if (data?.code === 'INVENTORY_CONFLICT') {
        toast.error('Inventory changed while placing your order. Please review your cart.');
        await syncAfterConflict({
          userId: user.id,
          productIds: items.map((i) => i.productId),
        });
        setError('One or more items sold out just now. Your cart has been updated — please try again.');

      } else if (data?.code === 'INSUFFICIENT_STOCK') {
        const n = data.availableStock ?? 0;
        setError(n === 0
          ? 'One item is now out of stock. Please remove it from your cart.'
          : `Only ${n} item(s) left. Please update your cart quantity.`);

      } else if (data?.code === 'MAX_QUANTITY_EXCEEDED') {
        setError(data.message ?? `Maximum ${data.availableStock} items allowed per order.`);

      } else if (data?.code === 'RESOURCE_NOT_FOUND') {
        setError('One or more products are no longer available. Please review your cart.');

      } else {
        setError(data?.message ?? 'Failed to place order. Please try again.');
      }
    } finally {
      setPlacing(false);
    }
  };

  return { placing, error, setError, placeOrder };
};