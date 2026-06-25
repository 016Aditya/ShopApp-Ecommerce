/**
 * useReturn.js — Phase 2C
 *
 * Public-facing return hook. All pages import from here.
 * Implementation delegated to TanStack Query hooks in
 * src/hooks/useQueryReturn.js.
 *
 * Public API (unchanged from legacy):
 *   { returnStatus, loading, error, fetchReturnStatus, requestReturn }
 *
 * Changes from legacy:
 *   - returnStatus    now comes from TQ cache (GET /api/orders/:id/return)
 *   - loading         maps to TQ isLoading / isPending
 *   - error           extracted from TQ error object
 *   - requestReturn   triggers the TQ mutation
 *   - fetchReturnStatus is now refetch() (no-op if data is fresh)
 *
 * 404 handling:
 *   useReturnStatusQuery treats 404 as null (return not initiated) — it never
 *   surfaces as an error, preserving the legacy behaviour.
 */
import {
  useReturnStatusQuery,
  useInitiateReturnMutation,
} from "@/hooks/useQueryReturn";

export const useReturn = (orderId) => {
  // ── Read ──────────────────────────────────────────────────────────────────
  const {
    data:    returnStatus,
    isLoading,
    error:   queryError,
    refetch,
  } = useReturnStatusQuery(orderId);

  // ── Write ─────────────────────────────────────────────────────────────────
  const mutation = useInitiateReturnMutation(orderId);

  // ── Derived state ─────────────────────────────────────────────────────────
  const loading = isLoading || mutation.isPending;

  const error =
    mutation.error
      ? (mutation.error.response?.data?.message ??
         mutation.error.message ??
         "Failed to initiate return")
      : queryError
      ? (queryError.response?.data?.message ?? queryError.message ?? null)
      : null;

  // ── requestReturn — public action ─────────────────────────────────────────
  // Matches legacy: returns the server response, throws on failure.
  const requestReturn = async () => {
    if (!orderId) throw new Error("Order ID is required");
    try {
      return await mutation.mutateAsync();
    } catch (err) {
      const message =
        err.response?.data?.message ?? err.message ?? "Failed to initiate return";
      throw new Error(message, { cause: err });
    }
  };

  // fetchReturnStatus is a stable refetch reference for backwards compat.
  const fetchReturnStatus = refetch;

  return {
    returnStatus: returnStatus ?? null,
    loading,
    error,
    fetchReturnStatus,
    requestReturn,
  };
};
