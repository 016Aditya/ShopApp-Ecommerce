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
  // Core lifecycle
  PENDING:           'PENDING',
  CONFIRMED:         'CONFIRMED',
  PACKED:            'PACKED',
  SHIPPED:           'SHIPPED',
  DELIVERED:         'DELIVERED',
  CANCELLED:         'CANCELLED',
  // Return flow
  RETURN_REQUESTED:  'RETURN_REQUESTED',
  RETURN_APPROVED:   'RETURN_APPROVED',
  PICKUP_SCHEDULED:  'PICKUP_SCHEDULED',
  PICKED_UP:         'PICKED_UP',
  REFUND_PROCESSED:  'REFUND_PROCESSED',
  RETURN_SUCCESSFUL: 'RETURN_SUCCESSFUL',
  RETURNED:          'RETURNED',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]:           'Pending',
  [ORDER_STATUS.CONFIRMED]:         'Confirmed',
  [ORDER_STATUS.PACKED]:            'Packed',
  [ORDER_STATUS.SHIPPED]:           'Shipped',
  [ORDER_STATUS.DELIVERED]:         'Delivered',
  [ORDER_STATUS.CANCELLED]:         'Cancelled',
  [ORDER_STATUS.RETURN_REQUESTED]:  'Return Requested',
  [ORDER_STATUS.RETURN_APPROVED]:   'Return Approved',
  [ORDER_STATUS.PICKUP_SCHEDULED]:  'Pickup Scheduled',
  [ORDER_STATUS.PICKED_UP]:         'Picked Up',
  [ORDER_STATUS.REFUND_PROCESSED]:  'Refund Processed',
  [ORDER_STATUS.RETURN_SUCCESSFUL]: 'Return Successful',
  [ORDER_STATUS.RETURNED]:          'Returned',
};

// Statuses that indicate the order is in the return flow
export const RETURN_STATUSES = new Set([
  ORDER_STATUS.RETURN_REQUESTED,
  ORDER_STATUS.RETURN_APPROVED,
  ORDER_STATUS.PICKUP_SCHEDULED,
  ORDER_STATUS.PICKED_UP,
  ORDER_STATUS.REFUND_PROCESSED,
  ORDER_STATUS.RETURN_SUCCESSFUL,
  ORDER_STATUS.RETURNED,
]);

// Statuses from which the customer can initiate a cancellation
export const CANCELLABLE_STATUSES = new Set([
  ORDER_STATUS.PENDING,
  ORDER_STATUS.CONFIRMED,
]);

// Statuses from which the customer can initiate a return
export const RETURNABLE_STATUSES = new Set([
  ORDER_STATUS.DELIVERED,
]);

// Tailwind badge classes per status
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]:           'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.CONFIRMED]:         'bg-blue-100   text-blue-800',
  [ORDER_STATUS.PACKED]:            'bg-indigo-100 text-indigo-800',
  [ORDER_STATUS.SHIPPED]:           'bg-purple-100 text-purple-800',
  [ORDER_STATUS.DELIVERED]:         'bg-green-100  text-green-800',
  [ORDER_STATUS.CANCELLED]:         'bg-red-100    text-red-800',
  [ORDER_STATUS.RETURN_REQUESTED]:  'bg-orange-100 text-orange-800',
  [ORDER_STATUS.RETURN_APPROVED]:   'bg-orange-100 text-orange-700',
  [ORDER_STATUS.PICKUP_SCHEDULED]:  'bg-cyan-100   text-cyan-800',
  [ORDER_STATUS.PICKED_UP]:         'bg-cyan-100   text-cyan-700',
  [ORDER_STATUS.REFUND_PROCESSED]:  'bg-teal-100   text-teal-800',
  [ORDER_STATUS.RETURN_SUCCESSFUL]: 'bg-teal-100   text-teal-700',
  [ORDER_STATUS.RETURNED]:          'bg-gray-100   text-gray-800',
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
