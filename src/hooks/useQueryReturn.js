/**
 * useQueryReturn.js — Phase 2C
 *
 * Raw TanStack Query hooks for Order Returns.
 * Consumed through src/features/orders/hooks/useReturn.js.
 *
 * Cache strategy:
 *   staleTime : 30 seconds
 *   gcTime    : 5 minutes
 *
 * Retry policy:
 *   Query    : network failures + HTTP 5xx only
 *              404 is NOT retried — it means no return has been initiated.
 *   Mutation : retry: 0
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getReturnStatus, initiateReturn } from "@/services/returnService";

const RETURN_STALE = 30 * 1000;       // 30 sec
const RETURN_GC    = 5 * 60 * 1000;  // 5 min

/** Returns true when the query should be retried for this error. */
const shouldRetry = (failureCount, error) => {
  if (failureCount >= 2) return false;
  const status = error?.response?.status;
  if (status === 404) return false;                       // not-initiated is valid
  if (!status) return true;                               // network failure
  if (status === 401 || status === 403) return false;
  if (status >= 400 && status < 500) return false;        // other 4xx
  return true;                                            // 5xx
};

// ─────────────────────────────────────────────────────────────────────────────
// useReturnStatusQuery — GET /api/orders/:orderId/return
// 404 is silenced → returns null ("return not initiated" is a valid state)
// ─────────────────────────────────────────────────────────────────────────────
export const useReturnStatusQuery = (orderId) =>
  useQuery({
    queryKey: queryKeys.returns.byOrder(orderId),
    queryFn:  async () => {
      try {
        const data = await getReturnStatus(orderId);
        return data?.status ?? null;
      } catch (err) {
        if (err.response?.status === 404) return null;
        throw err;
      }
    },
    enabled:  !!orderId,
    staleTime: RETURN_STALE,
    gcTime:    RETURN_GC,
    refetchOnWindowFocus: false,
    retry: shouldRetry,
  });

// ─────────────────────────────────────────────────────────────────────────────
// useInitiateReturnMutation — PATCH /api/orders/:orderId/return
//
// onSuccess → write return status to cache + invalidate order detail
// onSettled → background sync for return status
// ─────────────────────────────────────────────────────────────────────────────
export const useInitiateReturnMutation = (orderId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => initiateReturn(orderId),
    retry: 0,

    onSuccess: (data) => {
      const returnStatus = data?.status ?? "RETURN_REQUESTED";
      qc.setQueryData(queryKeys.returns.byOrder(orderId), returnStatus);
      qc.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.returns.byOrder(orderId) });
    },
  });
};
