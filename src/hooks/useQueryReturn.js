/**
 * useQueryReturn.js — Phase 2C
 *
 * Raw TanStack Query hooks for Order Returns.
 * Never imported directly by pages — consumed through
 * src/features/orders/hooks/useReturn.js.
 *
 * Cache strategy:
 *   staleTime : 30 seconds — return status can change quickly (admin updates)
 *   gcTime    : 5 minutes
 *
 * Retry policy:
 *   Query     : network failures + HTTP 5xx only
 *               404 is NOT retried — "return not initiated" is a valid state
 *   Mutation  : retry: 0
 *
 * Window focus: disabled — cache invalidation after mutation handles freshness.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getReturnStatus, initiateReturn } from "@/services/returnService";
import { isRetryable } from "@/lib/queryClient";

const RETURN_STALE = 30 * 1000;       // 30 sec
const RETURN_GC    = 5 * 60 * 1000;  // 5 min

// ─────────────────────────────────────────────────────────────────────────────
// useReturnStatusQuery
// GET /api/orders/:orderId/return
//
// 404 is silenced — it means no return has been initiated yet.
// The query is disabled when orderId is falsy.
// ─────────────────────────────────────────────────────────────────────────────
export const useReturnStatusQuery = (orderId) =>
  useQuery({
    queryKey: queryKeys.returns.byOrder(orderId),
    queryFn:  async () => {
      try {
        const data = await getReturnStatus(orderId);
        return data?.status ?? null;
      } catch (err) {
        // Treat 404 as "no return yet" — return null, don't throw
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
    enabled:  !!orderId,
    staleTime: RETURN_STALE,
    gcTime:    RETURN_GC,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Never retry 404
      if (error?.response?.status === 404) return false;
      return isRetryable(error) && failureCount < 2;
    },
  });

// ─────────────────────────────────────────────────────────────────────────────
// useInitiateReturnMutation
// PATCH /api/orders/:orderId/return
//
// After success:
//   - Update returns cache directly from server response
//   - Invalidate order detail so status badge refreshes
// ─────────────────────────────────────────────────────────────────────────────
export const useInitiateReturnMutation = (orderId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => initiateReturn(orderId),
    retry: 0,

    onSuccess: (data) => {
      // Write return status directly — no extra GET needed
      const returnStatus = data?.status ?? "RETURN_REQUESTED";
      qc.setQueryData(queryKeys.returns.byOrder(orderId), returnStatus);

      // Refresh order detail so the status badge and timeline update
      qc.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },

    onSettled: () => {
      // Confirm return status from server in the background
      qc.invalidateQueries({ queryKey: queryKeys.returns.byOrder(orderId) });
    },
  });
};
