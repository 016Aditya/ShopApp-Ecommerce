import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// POST /api/orders — body: { userId, quantity, address, productIds[] }
export const createOrder = async (orderData) => {
  const { data } = await api.post(API_ENDPOINTS.ORDERS, orderData);
  return data;
};

// GET /api/orders/user/:userId
export const getOrdersByUser = async (userId) => {
  const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/user/${userId}`);
  return data;
};

// GET /api/orders/:id
export const getOrderById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.ORDERS}/${id}`);
  return data;
};

// PATCH /api/orders/:id/status — body: { status }
export const updateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${id}/status`, { status });
  return data;
};

// DELETE /api/orders/:id
export const deleteOrder = async (id) => {
  await api.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
};