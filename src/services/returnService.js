import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

/**
 * returnService.js
 *
 * FIX: initiateReturn now uses PATCH (not POST) per backend contract:
 *   PATCH /api/orders/{id}/return
 *
 * The backend expects only { reason } in the body.
 * returnRequestedAt is set server-side, not passed from the client.
 */

// Initiate a return for an order — PATCH per spec
export const initiateReturn = async (orderId, reason = "") => {
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/return`, {
    reason,
  });
  return data;
};

// Get return status for an order
export const getReturnStatus = async (orderId) => {
  const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/${orderId}/return`);
  return data;
};

// Update return status (admin/system use)
export const updateReturnStatus = async (orderId, status) => {
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/return/status`, {
    status,
  });
  return data;
};

// Cancel a return request
export const cancelReturn = async (orderId) => {
  const { data } = await api.delete(`${API_ENDPOINTS.ORDERS}/${orderId}/return`);
  return data;
};
