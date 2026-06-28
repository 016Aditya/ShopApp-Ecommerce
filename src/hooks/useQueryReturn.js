/**
 * useQueryReturn.js
 *
 * FIX: Removed useReturnStatusQuery that called GET /api/orders/:id/return.
 * That endpoint does NOT exist in the backend (OrderController only has
 * POST /{orderId}/return). Every page load was hitting a 500.
 *
 * Return status is now derived directly from the order object's `status`
 * field — the GET /api/orders/{id} response already contains it
 * (RETURN_REQUESTED, RETURN_APPROVED, PICKED_UP, etc.).
 *
 * useReturnStatusQuery is replaced with a lightweight helper that reads
 * the already-cached order detail. No extra network call needed.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { initiateReturn } from "@/services/returnService";
import { getOrderById } from "@/services/orderService";
import { normalizeOrder } from "@/features/orders/utils/normalizeOrder";

const RETURN_STATUSES = new Set([
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "REFUND_PROCESSED",
  "RETURN_SUCCESSFUL",
  "RETURNED",
]);

// ─────────────────────────────────────────────────────────────────────────────
// useReturnStatusQuery
//
// Reads return status from the order detail cache — no extra network call.
// If the order is not yet in the cache, fetches it via getOrderById.
// Only enabled when the order status is in a return-related state so we
// never fire a network request for PENDING / SHIPPED / DELIVERED orders
// that haven't initiated a return yet.
// ─────────────────────────────────────────────────────────────────────────────
export const useReturnStatusQuery = (orderId) => {
  const qc = useQueryClient();

  return useQuery({
    queryKey: queryKeys.returns.byOrder(orderId),
    queryFn: async () => {
      // First try the already-cached order (free — no network)
      const cached = qc.getQueryData(queryKeys.orders.detail(orderId));
      const orderStatus = cached?.status?.toUpperCase();

      if (orderStatus && RETURN_STATUSES.has(orderStatus)) {
        return orderStatus;
      }

      // If order isn't cached yet, fetch it (will be normalised + cached)
      const fresh = await getOrderById(orderId);
      const normalized = normalizeOrder(fresh);
      qc.setQueryData(queryKeys.orders.detail(orderId), normalized);

      const freshStatus = normalized?.status?.toUpperCase();
      return RETURN_STATUSES.has(freshStatus) ? freshStatus : null;
    },
    // Only fire if there is evidence in the cache that a return was started.
    // This prevents ANY network call for orders that are simply PENDING/SHIPPED.
    enabled: (() => {
      if (!orderId) return false;
      const cached = qc.getQueryData(queryKeys.orders.detail(orderId));
      if (!cached) return false; // wait until order detail is loaded first
      const s = cached?.status?.toUpperCase();
      return RETURN_STATUSES.has(s);
    })(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// useInitiateReturnMutation — POST /api/orders/:orderId/return
//
// onSuccess → write return status to cache + invalidate order detail
// onSettled → background sync via order detail (no separate /return GET)
// ─────────────────────────────────────────────────────────────────────────────
export const useInitiateReturnMutation = (orderId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => initiateReturn(orderId),
    retry: 0,

    onSuccess: (data) => {
      // The POST /return response is the updated Order document.
      // status will be RETURN_REQUESTED.
      const returnStatus = data?.status?.toUpperCase() ?? "RETURN_REQUESTED";
      qc.setQueryData(queryKeys.returns.byOrder(orderId), returnStatus);
      // Also update the order detail cache so the status badge updates immediately
      qc.setQueryData(queryKeys.orders.detail(orderId), (old) =>
        old ? { ...old, status: returnStatus } : old
      );
    },

    onSettled: () => {
      // Background refresh of order detail to get server-confirmed state
      qc.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },
  });
};
