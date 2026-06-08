import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getAllProducts = async () => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCTS);
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  return data;
};

export const getProductsByCategory = async (category) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/category/${category}`);
  return data;
};

export const searchProducts = async (keyword) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/search`, {
    params: { keyword },
  });
  return data;
};