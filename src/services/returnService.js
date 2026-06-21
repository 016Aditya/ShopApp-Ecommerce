// src/services/returnService.js
import api from "../api/api.js";

// api baseURL is already http://localhost:8080/api (from constants.js)
// so service paths must start with /orders, NOT /api/orders
const ORDERS_BASE = "/orders";

/**
 * PATCH /api/orders/{id}/return
 *
 * Root-cause fix: was using POST, backend expects PATCH.
 * No request body — returnRequestedAt and refundStatus are set server-side.
 *
 * Backend validation:
 *   - Allows return only when status === DELIVERED
 *   - Returns 400 "This order cannot be returned." otherwise
 */
export const initiateReturn = async (orderId) => {
  const { data } = await api.patch(`${ORDERS_BASE}/${orderId}/return`);
  return data;
};

/**
 * GET /api/orders/{id}/return
 * Fetch the current return status for a specific order.
 */
export const getReturnStatus = async (orderId) => {
  const { data } = await api.get(`${ORDERS_BASE}/${orderId}/return`);
  return data;
};

/**
 * PATCH /api/orders/{id}/return/status
 * Admin: update return status (RETURN_APPROVED, PICKUP_SCHEDULED, etc.)
 */
export const updateReturnStatus = async (orderId, status) => {
  const { data } = await api.patch(
    `${ORDERS_BASE}/${orderId}/return/status`,
    { status }
  );
  return data;
};
