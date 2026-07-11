// 1. Point to the API instance that has the Interceptor!
import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// GET /api/cart/:userId
export const getCart = async (userId) => {
  const { data } = await api.get(`${API_ENDPOINTS.CART}/${userId}`);
  return data;
};

// POST /api/cart/:userId/add  — body: { productId, quantity }
export const addItemToCart = async (userId, productId, quantity) => {
  const { data } = await api.post(`${API_ENDPOINTS.CART}/${userId}/add`, {
    productId,
    quantity,
  });
  return data;
};

// PUT /api/cart/:userId/items  — body: { productId, quantity }
export const updateCartItem = async (userId, productId, quantity) => {
  const { data } = await api.put(`${API_ENDPOINTS.CART}/${userId}/items`, {
    productId,
    quantity,
  });
  return data;
};

// DELETE /api/cart/:userId/items/:productId
export const removeItemFromCart = async (userId, productId) => {
  const { data } = await api.delete(
    `${API_ENDPOINTS.CART}/${userId}/items/${productId}`
  );
  return data;
};

// DELETE /api/cart/:userId/clear
export const clearCart = async (userId) => {
  await api.delete(`${API_ENDPOINTS.CART}/${userId}/clear`);
};
