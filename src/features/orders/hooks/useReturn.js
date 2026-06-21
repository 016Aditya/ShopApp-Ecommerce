import { useCallback, useState } from "react";
import { initiateReturn, getReturnStatus } from "@/services/returnService";

/**
 * useReturn
 *
 * Hook for the return flow on a single order.
 *
 * - requestReturn(): calls PATCH /api/orders/{id}/return (no body)
 * - fetchReturnStatus(): calls GET /api/orders/{id}/return
 *   404 is silenced — return not yet initiated is a valid state.
 */
export const useReturn = (orderId) => {
  const [returnStatus, setReturnStatus] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  const fetchReturnStatus = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getReturnStatus(orderId);
      setReturnStatus(data?.status ?? null);
    } catch (err) {
      // 404 = return not initiated yet — not an error worth surfacing
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Failed to fetch return status");
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const requestReturn = useCallback(async () => {
    if (!orderId) throw new Error("Order ID is required");
    setLoading(true);
    setError(null);
    try {
      const data = await initiateReturn(orderId);
      setReturnStatus(data?.status ?? "RETURN_REQUESTED");
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to initiate return";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  return { returnStatus, loading, error, fetchReturnStatus, requestReturn };
};
