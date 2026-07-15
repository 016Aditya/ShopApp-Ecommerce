/**
 * cartValidation.js
 *
 * Single source of truth for all frontend quantity validation.
 * Components must NOT duplicate these rules internally.
 *
 * Rules mirror CartValidator.java exactly:
 *   1. requestedQuantity must be <= stock
 *   2. requestedQuantity must be <= maxOrderQuantity
 *
 * Stock is NEVER modified here — backend remains the source of truth.
 */

/**
 * Returns the effective upper limit for a quantity selector.
 *
 * @param {number} stock
 * @param {number} maxOrderQuantity
 * @returns {number}
 */
export const getQuantityLimit = (stock, maxOrderQuantity = 10) =>
  Math.min(stock ?? 0, maxOrderQuantity ?? 10);

/**
 * Validate whether the quantity can be incremented by one.
 *
 * Validation order (stock always checked first):
 *   1. Stock limit
 *   2. Purchase limit
 *
 * @param {{ quantity: number, stock: number, maxOrderQuantity?: number }} params
 * @returns {{ valid: boolean, reason?: 'STOCK_LIMIT'|'PURCHASE_LIMIT', message?: string }}
 */
export const validateQuantity = ({ quantity, stock, maxOrderQuantity = 10 }) => {
  const requestedQty = quantity + 1;
  const effectiveStock = stock ?? 0;
  const effectiveLimit = maxOrderQuantity > 0 ? maxOrderQuantity : 10;

  // ── 1. Stock check (always first) ─────────────────────────────────────────
  if (requestedQty > effectiveStock) {
    const itemWord = effectiveStock === 1 ? 'item' : 'items';
    return {
      valid: false,
      reason: 'STOCK_LIMIT',
      message: `Only ${effectiveStock} ${itemWord} available in stock.`,
    };
  }

  // ── 2. Purchase limit check ────────────────────────────────────────────────
  if (requestedQty > effectiveLimit) {
    return {
      valid: false,
      reason: 'PURCHASE_LIMIT',
      message: `Maximum ${effectiveLimit} items allowed per order.`,
    };
  }

  return { valid: true };
};

/**
 * Legacy helper — validates a raw requestedQuantity value.
 * Kept for any future use; components should prefer validateQuantity().
 *
 * @param {number} requestedQuantity
 * @param {number} stock
 * @param {number} maxOrderQuantity
 * @returns {{ valid: boolean, message: string | null }}
 */
export const validateCartQuantity = (requestedQuantity, stock, maxOrderQuantity = 10) => {
  if (requestedQuantity < 1) {
    return { valid: false, message: null };
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
 *
 * @param {number} currentQuantity
 * @param {number} stock
 * @param {number} maxOrderQuantity
 * @returns {boolean}
 */
export const isAtQuantityLimit = (currentQuantity, stock, maxOrderQuantity = 10) =>
  currentQuantity >= getQuantityLimit(stock, maxOrderQuantity);
