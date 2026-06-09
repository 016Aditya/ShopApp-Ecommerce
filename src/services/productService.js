import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// GET /api/products
export const getAllProducts = async () => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCTS);
  return data; // ProductDto.Response[]
};

// GET /api/products/:id
export const getProductById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  return data;
};

// GET /api/products/category/:category
export const getProductsByCategory = async (category) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/category/${category}`);
  return data;
};

// GET /api/products/search?keyword=...
export const searchProducts = async (keyword) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/search`, {
    params: { keyword },
  });
  return data;
};