/**
 * constants.js
 *
 * Application-wide constants.
 * Business rules, limits, labels, and lookup maps.
 *
 * Rules:
 *  - No import.meta.env here — use env.js for that
 *  - No React, no hooks, no side effects
 *  - Values that come from the backend (e.g. ORDER_STATUS) must exactly
 *    match the backend enum strings
 */

// ── Roles — must match Spring Security GrantedAuthority strings ───────────────
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER:  'USER',
};

// ── localStorage keys — change in one place if keys ever rotate ───────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN:   'auth_token',
  AUTH_USER:    'auth_user',
  AUTH_STORAGE: 'auth-storage', // Zustand persist key
};

// ── Order status — must match backend Order entity enum exactly ───────────────
export const ORDER_STATUS = {
  PENDING:   'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED:   'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]:   'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.SHIPPED]:   'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};

// Tailwind badge classes per status
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]:   'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.CONFIRMED]: 'bg-blue-100   text-blue-800',
  [ORDER_STATUS.SHIPPED]:   'bg-purple-100 text-purple-800',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100  text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100    text-red-800',
};

// ── Product categories — keep in sync with backend seed data ─────────────────
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Kitchen',
  'Sports',
  'Beauty',
  'Toys',
  'Automotive',
];

// ── Review ratings ────────────────────────────────────────────────────────────
export const RATING_MIN = 1;
export const RATING_MAX = 5;

// ── Pagination ────────────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE:     48,
};

// ── Cart ──────────────────────────────────────────────────────────────────────
export const CART_LIMITS = {
  MAX_QUANTITY: 99,
  MIN_QUANTITY: 1,
};

// ── Currency / Locale ─────────────────────────────────────────────────────────
export const CURRENCY = {
  CODE:   'INR',
  LOCALE: 'en-IN',
  SYMBOL: '₹',
};

// ── App routes — single source of truth for all <Link to="..." /> ─────────────
export const ROUTES = {
  HOME:           '/',
  LOGIN:          '/login',
  REGISTER:       '/register',
  PRODUCTS:       '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART:           '/cart',
  CHECKOUT:       '/checkout',
  ORDERS:         '/orders',
  ORDER_DETAIL:   '/orders/:id',
  PROFILE:        '/profile',
  WISHLIST:       '/wishlist',
  ADMIN:          '/admin',
};

// Helper to build dynamic routes — avoids template literals scattered in the UI
export const buildRoute = {
  productDetail: (id) => `/products/${id}`,
  orderDetail:   (id) => `/orders/${id}`,
};
