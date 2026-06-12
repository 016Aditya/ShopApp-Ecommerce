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

export const updateOrderStatus = async (id, status) => {
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${id}/status`, { status });
  return data;
};

// Cancel order — PATCH status to CANCELLED
export const cancelOrder = async (id) => {
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${id}/status`, {
    status: "CANCELLED",
  });
  return data;
};

export const deleteOrder = async (id) => {
  await api.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
};
