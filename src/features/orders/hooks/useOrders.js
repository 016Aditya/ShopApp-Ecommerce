/**
 * useOrders.js — Phase 2B
 *
 * Public-facing hooks for the Orders domain.
 * All data fetching and mutation is now delegated to TanStack Query hooks
 * defined in src/hooks/useQueryOrders.js.
 *
 * Public API is preserved exactly so OrdersPage, OrderDetailPage,
 * and CheckoutPage require no changes:
 *
 *   useOrders()      → { orders, loading, error, fetchOrders }
 *   useOrder(id)     → { order, loading, error }
 *   usePlaceOrder()  → { placeOrder, loading, error }
 *   useCancelOrder() → { cancelOrder, loading, error }  ← new; replaces direct service call
 *
 * What changed from Phase 2A:
 *   All useState + useEffect + manual loading/error/retry replaced with
 *   TanStack Query. fetchOrders() now wraps TQ refetch — calling it manually
 *   (e.g. from a Retry button) triggers a fresh network request.
 */
import { useAuth } from '@/context/AuthContext';
import {
  useCancelOrderMutation,
  useOrderDetailQuery,
  useOrdersQuery,
  usePlaceOrderMutation,
} from '@/hooks/useQueryOrders';

// ── Orders list ──────────────────────────────────────────────────────────────
export const useOrders = () => {
  const { data: orders = [], isLoading, isError, error, refetch } = useOrdersQuery();

  return {
    orders,
    loading:     isLoading,
    error:       isError
      ? (error?.response?.data?.message ?? error?.message ?? 'Failed to load orders')
      : null,
    fetchOrders: refetch,
  };
};

// ── Single order detail ──────────────────────────────────────────────────────
export const useOrder = (id) => {
  const { data: order = null, isLoading, isError, error } = useOrderDetailQuery(id);

  return {
    order,
    loading: isLoading,
    error:   isError
      ? (error?.response?.data?.message ?? error?.message ?? 'Order not found')
      : null,
  };
};

// ── Place order ──────────────────────────────────────────────────────────────
export const usePlaceOrder = () => {
  const { mutateAsync, isPending, error } = usePlaceOrderMutation();

  const placeOrder = async (orderData) => {
    // Re-throw so CheckoutPage catch block continues to work unchanged
    return mutateAsync(orderData);
  };

  return {
    placeOrder,
    loading: isPending,
    error:   error
      ? (error?.response?.data?.message ?? error?.message ?? 'Failed to place order')
      : null,
  };
};

// ── Cancel order ─────────────────────────────────────────────────────────────
/**
 * useCancelOrder
 *
 * Replaces the direct `cancelOrder` service import in OrderDetailPage.
 * userId is read from AuthContext here so callers do not need to thread it.
 * The orderId is passed by the caller as before.
 *
 * After success, invalidates:
 *   orders.byUser(userId)   — status badge in Orders List updates
 *   orders.detail(orderId)  — status in Order Detail updates
 */
export const useCancelOrder = () => {
  const { user }                          = useAuth();
  const { mutateAsync, isPending, error } = useCancelOrderMutation();

  const cancelOrder = async (orderId) => {
    return mutateAsync({ orderId, userId: user?.id });
  };

  return {
    cancelOrder,
    loading: isPending,
    error:   error
      ? (error?.response?.data?.message ?? error?.message ?? 'Failed to cancel order')
      : null,
  };
};
