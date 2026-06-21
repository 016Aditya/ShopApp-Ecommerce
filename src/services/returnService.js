import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

/**
 * returnService.js
 *
 * PATCH /api/orders/{id}/return  — no request body.
 * Backend sets: status=RETURN_REQUESTED, returnRequestedAt=now(), refundStatus=PENDING
 */

// Initiate a return — PATCH per backend contract, no body
export const initiateReturn = async (orderId) => {
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/return`);
  return data;
};

// Get return status for an order
export const getReturnStatus = async (orderId) => {
  const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/${orderId}/return`);
  return data;
};

// Update return status (admin/system use)
export const updateReturnStatus = async (orderId, status) => {
  const { data } = await api.patch(
    `${API_ENDPOINTS.ORDERS}/${orderId}/return/status`,
    { status }
  );
  return data;
};
