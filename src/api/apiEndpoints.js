// Single source of truth for all API endpoint constants.
// Axios baseURL = http://localhost:8080/api
// Therefore all paths below are relative to /api (no /api prefix here)

export const API_ENDPOINTS = {
  AUTH: "/users",
  USERS: "/users", // used by profileService, userService
  PRODUCTS: "/products",
  ORDERS: "/orders",
  REVIEWS: "/reviews",
  CART: "/cart",
};

// Addresses
// Backend: AddressController @RequestMapping("/api/v1/addresses")
// Relative to Axios baseURL /api, the prefix must be /v1/addresses
export const ADDRESSES = {
  BASE: "/v1/addresses",
  list: () => "/v1/addresses",
  detail: (id) => `/v1/addresses/${id}`,
  create: () => "/v1/addresses",
  update: (id) => `/v1/addresses/${id}`,
  delete: (id) => `/v1/addresses/${id}`,
  setDefault: (id) => `/v1/addresses/${id}/default`,
};
