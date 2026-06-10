import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// GET /api/products
export const getAllProducts = async () => {
  const { data } = await api.get(API_ENDPOINTS.PRODUCTS);
  return data;
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

// GET /api/products/category/:category/subcategory/:sub
export const getProductsByCategoryAndSubcategory = async (category, subcategory) => {
  const { data } = await api.get(
    `${API_ENDPOINTS.PRODUCTS}/category/${category}/subcategory/${subcategory}`
  );
  return data;
};

// GET /api/products/subcategory/:sub
export const getProductsBySubcategory = async (subcategory) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/subcategory/${subcategory}`);
  return data;
};

// GET /api/products/brand/:brand
export const getProductsByBrand = async (brand) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/brand/${brand}`);
  return data;
};

// GET /api/products/search?keyword=...
export const searchProducts = async (keyword) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/search`, {
    params: { keyword },
  });
  return data;
};

// GET /api/products/price?min=&max=
export const getProductsByPriceRange = async (min, max) => {
  const { data } = await api.get(`${API_ENDPOINTS.PRODUCTS}/price`, {
    params: { min, max },
  });
  return data;
};
