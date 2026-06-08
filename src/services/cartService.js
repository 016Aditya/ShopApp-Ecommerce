import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getCart = async (userId) => {
  const { data } = await api.get(`${API_ENDPOINTS.CART}/${userId}`);
  return data;
};

export const addItemToCart = async (userId, productId, quantity = 1) => {
  const { data } = await api.post(`${API_ENDPOINTS.CART}/${userId}/add`, {
    productId,
    quantity,
  });
  return data;
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
  const { data } = await api.put(`${API_ENDPOINTS.CART}/${userId}/items`, {
    productId,
    quantity,
  });
  return data;
};

export const removeCartItem = async (userId, productId) => {
  const { data } = await api.delete(`${API_ENDPOINTS.CART}/${userId}/items/${productId}`);
  return data;
};

export const clearCart = async (userId) => {
  const { data } = await api.delete(`${API_ENDPOINTS.CART}/${userId}/clear`);
  return data;
};