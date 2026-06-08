import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const createOrder = async (orderRequest) => {
  const { data } = await api.post(API_ENDPOINTS.ORDERS, orderRequest);
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
  const { data } = await api.patch(`${API_ENDPOINTS.ORDERS}/${id}/status`, {
    status,
  });
  return data;
};