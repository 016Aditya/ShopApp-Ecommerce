import { useCallback, useState } from "react";
import { initiateReturn, getReturnStatus } from "@/services/returnService";

export const useReturn = (orderId) => {
  const [returnStatus, setReturnStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReturnStatus = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getReturnStatus(orderId);
      setReturnStatus(data?.status || null);
    } catch (err) {
      // It's OK if the endpoint doesn't exist or return is not initiated yet
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Failed to fetch return status");
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const requestReturn = useCallback(
    async (reason = "") => {
      if (!orderId) throw new Error("Order ID is required");

      setLoading(true);
      setError(null);

      try {
        const data = await initiateReturn(orderId, reason);
        setReturnStatus(data?.status || "RETURN_REQUESTED");
        return data;
      } catch (err) {
        const message = err.response?.data?.message || "Failed to initiate return";
        setError(message);
        throw new Error(message, { cause: err });
      } finally {
        setLoading(false);
      }
    },
    [orderId]
  );

  return {
    returnStatus,
    loading,
    error,
    fetchReturnStatus,
    requestReturn,
  };
};
