// src/services/returnService.js
import api from "../api/api.js";

// api baseURL is already http://localhost:8080/api (from constants.js)
// so service paths must start with /orders, NOT /api/orders
const ORDERS_BASE = "/orders";

/**
 * initiateReturn
 * POST /api/orders/{id}/return
 *
 * FIX: The backend OrderController uses @PostMapping("/{orderId}/return").
 * This is the ONLY return endpoint that exists on the backend.
 * There is NO GET /return endpoint — that was calling a non-existent route,
 * causing a 500 on every order detail page load.
 *
 * No request body — returnRequestedAt and refundStatus are set server-side.
 * Backend validation: only allows return when status === DELIVERED.
 * Returns 409 CONFLICT for non-DELIVERED orders.
 */
export const initiateReturn = async (orderId) => {
  const { data } = await api.post(`${ORDERS_BASE}/${orderId}/return`);
  return data;
};

/**
 * getReturnStatus — REMOVED
 *
 * The backend has NO GET /api/orders/{id}/return endpoint.
 * Calling it caused a Spring 500 on every OrderDetailPage load.
 *
 * Return status is derived directly from the order's `status` field
 * (e.g. RETURN_REQUESTED, RETURN_APPROVED, etc.) which is already
 * included in the GET /api/orders/{id} response.
 *
 * useQueryReturn.js now reads order.status instead of making a
 * separate GET /return call.
 */
