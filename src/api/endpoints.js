/**
 * endpoints.js
 *
 * Single source of truth for every API URL segment.
 *
 * Rules:
 *  - Strings are path segments only (no base URL, no trailing slash)
 *  - Dynamic segments are builder functions, not template literals scattered in services
 *  - When the backend URL changes, this is the ONLY file that needs updating
 *
 * Usage in services:
 *   import { CART, PRODUCTS, AUTH_ENDPOINTS } from '@/api/endpoints';
 *   api.get(CART.byUser(userId))
 *   api.get(PRODUCTS.detail(productId))
 */

// ── Auth / Users ──────────────────────────────────────────────────────────────
export const AUTH = {
  BASE:            '/users',
  register:        () => '/users/register',
  login:           () => '/users/login',
  forgotPassword:  () => '/users/forgot-password',
  verifyIdentity:  () => '/users/verify-identity',
  resetPassword:   () => '/users/reset-password',
  byId:            (id) => `/users/${id}`,
};

// Used by interceptors.js to detect auth endpoints (skip auto-logout on 401)
export const AUTH_ENDPOINTS = {
  LOGIN:          '/users/login',
  REGISTER:       '/users/register',
  FORGOT:         '/users/forgot-password',
  VERIFY:         '/users/verify-identity',
  RESET:          '/users/reset-password',
};

// ── Products ──────────────────────────────────────────────────────────────────
export const PRODUCTS = {
  BASE:           '/products',
  list:           () => '/products',
  detail:         (id) => `/products/${id}`,
  byCategory:     (category) => `/products?category=${encodeURIComponent(category)}`,
  search:         (query) => `/products/search?q=${encodeURIComponent(query)}`,
};

// ── Cart ──────────────────────────────────────────────────────────────────────
export const CART = {
  BASE:           '/cart',
  byUser:         (userId) => `/cart/${userId}`,
  addItem:        (userId) => `/cart/${userId}/add`,
  updateItem:     (userId) => `/cart/${userId}/items`,
  removeItem:     (userId, productId) => `/cart/${userId}/items/${productId}`,
  clear:          (userId) => `/cart/${userId}/clear`,
};

// ── Orders ────────────────────────────────────────────────────────────────────
export const ORDERS = {
  BASE:           '/orders',
  list:           () => '/orders',
  detail:         (id) => `/orders/${id}`,
  byUser:         (userId) => `/orders/user/${userId}`,
  place:          () => '/orders',
  cancel:         (id) => `/orders/${id}/cancel`,
};

// ── Addresses ─────────────────────────────────────────────────────────────────
// Backend: AddressController at /api/v1/addresses
// All endpoints are automatically JWT-protected via SecurityConfig anyRequest().authenticated()
export const ADDRESSES = {
  BASE:           '/addresses',
  list:           ()   => '/addresses',
  detail:         (id) => `/addresses/${id}`,
  create:         ()   => '/addresses',
  update:         (id) => `/addresses/${id}`,
  delete:         (id) => `/addresses/${id}`,
  setDefault:     (id) => `/addresses/${id}/default`,
};

// ── Reviews ───────────────────────────────────────────────────────────────────
export const REVIEWS = {
  BASE:           '/reviews',
  byProduct:      (productId) => `/reviews/product/${productId}`,
  submit:         () => '/reviews',
  delete:         (id) => `/reviews/${id}`,
};

// ── Returns ───────────────────────────────────────────────────────────────────
export const RETURNS = {
  BASE:           '/returns',
  request:        () => '/returns',
  status:         (id) => `/returns/${id}`,
  byOrder:        (orderId) => `/returns/order/${orderId}`,
};

// ── Profile ───────────────────────────────────────────────────────────────────
export const PROFILE = {
  BASE:           '/users',
  get:            (userId) => `/users/${userId}`,
  update:         (userId) => `/users/${userId}`,
};
