// src/services/returnService.js
import api from "../api/api.js";

const ORDERS_BASE = "/orders";

/**
 * initiateReturn
 * POST /api/orders/{id}/return
 *
 * Backend @PostMapping("/{orderId}/return") expects a @RequestBody
 * ReturnRequest { reason: string, requestedAt: string }.
 *
 * FIX: Sending an empty body {} instead of no body so Jackson can
 * deserialize it into ReturnRequest without a 400/500.
 * reason defaults to empty string (the backend OrderService accepts it).
 */
export const initiateReturn = async (orderId) => {
  const { data } = await api.post(`${ORDERS_BASE}/${orderId}/return`, {
    reason:      "",
    requestedAt: new Date().toISOString(),
  });
  return data;
};

/**
 * getReturnStatus — REMOVED
 *
 * The backend has NO GET /api/orders/{id}/return endpoint.
 * Return status is read from the order's `status` field directly.
 */
