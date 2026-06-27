/**
 * useQueryOrders.js — Phase 2B
 *
 * Low-level TanStack Query hooks for the Orders domain.
 * These are NOT consumed by pages directly — they are consumed by
 * the public-facing wrappers in src/features/orders/hooks/useOrders.js.
 *
 * Cache strategy:
 *   staleTime : 30 s  — short window reduces requests on rapid navigation
 *                       while still serving fresh data in most sessions
 *   gcTime    :  5 min — keeps data in memory across Order List ↔ Detail navigation
 *
 * refetchOnWindowFocus is left at the TanStack default (true) for queries but
 * targeted cache invalidation after mutations is the primary freshness mechanism.
 *
 * Retry policy (mutations inherit retry: 0; queries inherit global config):
 *   Network failures / 5xx  → retry (global queryClient config)
 *   400 / 401 / 403 / 404   → no retry (global queryClient config)
 *   Mutations               → retry: 0 (never retry mutations automatically)
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrdersByUser,
} from '@/services/orderService';
import {
  normalizeOrder,
  normalizeOrdersResponse,
} from '@/features/orders/utils/normalizeOrder';
import { queryKeys } from '@/lib/queryKeys';

const STALE_ORDERS = 30_000;      // 30 seconds
const GC_ORDERS    = 5 * 60_000; // 5 minutes

// ── Orders list ─────────────────────────────────────────────────────────────
export function useOrdersQuery() {
  const { user } = useAuth();
  const userId   = user?.id;

  return useQuery({
    queryKey: queryKeys.orders.byUser(userId),
    queryFn:  async () => {
      const data = await getOrdersByUser(userId);
      return normalizeOrdersResponse(data);
    },
    enabled:   Boolean(userId),
    staleTime: STALE_ORDERS,
    gcTime:    GC_ORDERS,
  });
}

// ── Single order detail ──────────────────────────────────────────────────────
export function useOrderDetailQuery(id) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn:  async () => {
      const data = await getOrderById(id);
      return normalizeOrder(data);
    },
    enabled:   Boolean(id),
    staleTime: STALE_ORDERS,
    gcTime:    GC_ORDERS,
  });
}

// ── Place order mutation ─────────────────────────────────────────────────────
/**
 * On success:
 *   Invalidate orders.byUser so the Orders List page reflects the new order
 *   on the next visit without a full page reload.
 *
 * We do NOT invalidate order detail — the detail page navigates fresh on mount.
 */
export function usePlaceOrderMutation() {
  const qc       = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (orderData) => createOrder(orderData),
    retry: 0,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.byUser(user?.id) });
    },
  });
}

// ── Cancel order mutation ────────────────────────────────────────────────────
/**
 * Variables shape: { orderId: string, userId: string }
 *
 * On success:
 *   Invalidate the order list for this user so the status badge updates.
 *   Invalidate the specific order detail so the detail page reflects CANCELLED.
 */
export function useCancelOrderMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId }) => cancelOrder(orderId),
    retry: 0,
    onSuccess: (_data, { orderId, userId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.byUser(userId) });
      qc.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },
  });
}
