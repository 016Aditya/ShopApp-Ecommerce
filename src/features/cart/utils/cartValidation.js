/**
 * cartValidation.js — Commit 1
 *
 * Single source of truth for all frontend quantity validation.
 * Components must NOT duplicate these rules internally.
 *
 * Rules mirror CartValidator.java exactly:
 *   1. requestedQuantity must be <= stock
 *   2. requestedQuantity must be <= maxOrderQuantity
 *
 * No stock is ever modified here. Commit 2 scope.
 */

/**
 * Returns the effective upper limit for a quantity selector.
 * Always use this instead of reading stock or maxOrderQuantity directly.
 *
 * @param {number} stock            - product.stock from API
 * @param {number} maxOrderQuantity - product.maxOrderQuantity from API (default 10)
 * @returns {number}
 */
export const getQuantityLimit = (stock, maxOrderQuantity = 10) =>
  Math.min(stock ?? 0, maxOrderQuantity ?? 10);

/**
 * Validate a quantity change before calling the backend.
 *
 * @param {number} requestedQuantity
 * @param {number} stock
 * @param {number} maxOrderQuantity
 * @returns {{ valid: boolean, message: string | null }}
 */
export const validateCartQuantity = (requestedQuantity, stock, maxOrderQuantity = 10) => {
  if (requestedQuantity < 1) {
    return { valid: false, message: null }; // removal — caller handles
  }

  if (stock === 0) {
    return { valid: false, message: 'This product is out of stock.' };
  }

  if (requestedQuantity > stock) {
    return {
      valid: false,
      message: stock === 1
        ? 'Only 1 item left in stock.'
        : `Only ${stock} items left in stock.`,
    };
  }

  const limit = maxOrderQuantity > 0 ? maxOrderQuantity : 10;
  if (requestedQuantity > limit) {
    return {
      valid: false,
      message: `Maximum ${limit} item${limit === 1 ? '' : 's'} allowed per order.`,
    };
  }

  return { valid: true, message: null };
};

/**
 * Returns true when the + button should be disabled.
 * Use this as the single disabled condition on the increment button.
 *
 * @param {number} currentQuantity
 * @param {number} stock
 * @param {number} maxOrderQuantity
 * @returns {boolean}
 */
export const isAtQuantityLimit = (currentQuantity, stock, maxOrderQuantity = 10) =>
  currentQuantity >= getQuantityLimit(stock, maxOrderQuantity);