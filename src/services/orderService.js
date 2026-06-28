import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

export const createOrder = async (orderData) => {
  const { data } = await api.post(API_ENDPOINTS.ORDERS, orderData);
  return data;
};

export const getOrdersByUser = async (userId) => {
  const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/user/${userId}`);
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/${id}`);
  return data;
};

/**
 * updateOrderStatus — admin use only.
 * FIX: backend OrderController uses @PutMapping, not @PatchMapping.
 * Changed from api.patch → api.put.
 */
export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`${API_ENDPOINTS.ORDERS}/${id}/status`, { status });
  return data;
};

/**
 * cancelOrder
 * FIX: backend @PutMapping("/{orderId}/cancel") is a dedicated cancel endpoint.
 * Changed from PATCH /status → PUT /cancel to match the controller exactly.
 */
export const cancelOrder = async (id) => {
  const { data } = await api.put(`${API_ENDPOINTS.ORDERS}/${id}/cancel`);
  return data;
};

export const deleteOrder = async (id) => {
  await api.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
};
