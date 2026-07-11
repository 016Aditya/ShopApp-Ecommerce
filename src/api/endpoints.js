/**
 * endpoints.js
 *
 * Secondary endpoint definitions for feature-level imports.
 * The canonical source of truth is src/api/apiEndpoints.js.
 * This file re-exports from apiEndpoints so legacy imports
 * (import { ADDRESSES } from '@/api/endpoints') keep working.
 *
 * Rules:
 *  - Strings are path segments only (no base URL, no trailing slash)
 *  - Axios baseURL = http://localhost:8080/api
 *  - All paths are relative to /api
 */

export { API_ENDPOINTS, ADDRESSES } from '@/api/apiEndpoints';

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
