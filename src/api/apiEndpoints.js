export const API_ENDPOINTS = {
  AUTH: "/users",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  REVIEWS: "/reviews",
  CART: "/cart",
};

export const ADDRESSES = {
  BASE: "/v1/addresses",

  list: () => "/v1/addresses",
  detail: (id) => `/v1/addresses/${id}`,
  create: () => "/v1/addresses",
  update: (id) => `/v1/addresses/${id}`,
  delete: (id) => `/v1/addresses/${id}`,
  setDefault: (id) => `/v1/addresses/${id}/default`,
};