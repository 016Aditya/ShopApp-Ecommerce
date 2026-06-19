import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// Initiate a return for an order
export const initiateReturn = async (orderId, reason = "") => {
  const { data } = await api.post(`${API_ENDPOINTS.ORDERS}/${orderId}/return`, {
    reason,
    requestedAt: new Date().toISOString(),
  });
  if (import.meta.env.DEV) {
    console.log("Return initiated:", data);
  }
  return data;
};

// Get return status for an order
export const getReturnStatus = async (orderId) => {
  const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/${orderId}/return`);
  if (import.meta.env.DEV) {
    console.log("Return status:", data);
  }
  return data;
};

// Update return status (admin/system only, but good to have)
export const updateReturnStatus = async (orderId, status) => {
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${orderId}/return`, {
    status,
    updatedAt: new Date().toISOString(),
  });
  if (import.meta.env.DEV) {
    console.log("Return status updated:", data);
  }
  return data;
};

// Cancel a return request
export const cancelReturn = async (orderId) => {
  const { data } = await api.delete(`${API_ENDPOINTS.ORDERS}/${orderId}/return`);
  if (import.meta.env.DEV) {
    console.log("Return cancelled:", data);
  }
  return data;
};
