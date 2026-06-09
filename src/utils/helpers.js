// ─── General-purpose helpers ──────────────────────────────────────────────────
// Logic that doesn't belong in a single domain utility file.

import { MIN_CART_QUANTITY, MAX_CART_QUANTITY } from "./constants";

// ── Object / Array ────────────────────────────────────────────────────────────

/**
 * Returns true if a value is a non-null object (not an array).
 */
export function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Removes keys with null/undefined/empty-string values from an object.
 * Useful for cleaning up request bodies before sending to the backend.
 *
 * cleanObject({ name: "Raj", email: "", role: null }) → { name: "Raj" }
 */
export function cleanObject(obj) {
  if (!isPlainObject(obj)) return obj;
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== null && v !== undefined && v !== ""
    )
  );
}

/**
 * Groups an array of objects by a key.
 * groupBy(orders, "status") → { PENDING: [...], DELIVERED: [...] }
 */
export function groupBy(array, key) {
  return array.reduce((acc, item) => {
    const group = item[key] ?? "other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

/**
 * Sorts an array of objects by a key.
 * sortBy(products, "price", "asc")
 */
export function sortBy(array, key, direction = "asc") {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

// ── Cart ──────────────────────────────────────────────────────────────────────

/**
 * Clamps a quantity value between MIN and MAX cart bounds.
 * clampQuantity(150) → 99
 * clampQuantity(0)   → 1
 */
export function clampQuantity(qty) {
  const n = Number(qty) || MIN_CART_QUANTITY;
  return Math.min(Math.max(n, MIN_CART_QUANTITY), MAX_CART_QUANTITY);
}

/**
 * Checks if a productId is already in the cart items array.
 * isInCart(cartItems, "abc123") → true | false
 */
export function isInCart(cartItems = [], productId) {
  return cartItems.some((item) => item.productId === productId);
}

/**
 * Gets a specific cart item by productId.
 * getCartItem(cartItems, "abc123") → CartItem | undefined
 */
export function getCartItem(cartItems = [], productId) {
  return cartItems.find((item) => item.productId === productId);
}

// ── String ────────────────────────────────────────────────────────────────────

/**
 * Capitalises the first letter of a string.
 * capitalise("hello world") → "Hello world"
 */
export function capitalise(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a camelCase or snake_case key to a readable label.
 * toLabel("firstName")   → "First Name"
 * toLabel("total_price") → "Total Price"
 */
export function toLabel(str) {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Builds a query string from an object.
 * toQueryString({ keyword: "shirt", category: "Clothing" }) → "?keyword=shirt&category=Clothing"
 */
export function toQueryString(params = {}) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries).toString();
}

// ── Error ─────────────────────────────────────────────────────────────────────

/**
 * Extracts the most useful error message from an Axios error or plain Error.
 * Works with your Spring Boot GlobalExceptionHandler responses.
 *
 * extractErrorMessage(err) → "Product not found!"
 */
export function extractErrorMessage(err, fallback = "Something went wrong") {
  // Spring Boot error body: { message: "..." } or { error: "..." }
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.error) return err.response.data.error;
  if (typeof err?.response?.data === "string") return err.response.data;
  if (err?.message) return err.message;
  return fallback;
}