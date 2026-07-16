const DEFAULT_MAX_ORDER_QUANTITY = 10;

const getEffectiveLimit = (maxOrderQuantity) =>
  maxOrderQuantity > 0 ? maxOrderQuantity : DEFAULT_MAX_ORDER_QUANTITY;

const buildQuantityValidationResult = (requestedQuantity, stock, maxOrderQuantity = DEFAULT_MAX_ORDER_QUANTITY) => {
  const effectiveStock = stock ?? 0;
  const effectiveLimit = getEffectiveLimit(maxOrderQuantity);

  if (effectiveStock <= 0) {
    return {
      valid: false,
      reason: 'OUT_OF_STOCK',
      title: 'Out of Stock',
      message: 'This item is unavailable.',
    };
  }

  if (requestedQuantity > effectiveStock) {
    return {
      valid: false,
      reason: 'STOCK_LIMIT',
      title: 'Stock Limit',
      message: `Only ${effectiveStock} items available.`,
    };
  }

  if (requestedQuantity > effectiveLimit) {
    return {
      valid: false,
      reason: 'PURCHASE_LIMIT',
      title: 'Purchase Limit',
      message: `Maximum ${effectiveLimit} items allowed.`,
    };
  }

  return { valid: true };
};

export const getQuantityLimit = (stock, maxOrderQuantity = DEFAULT_MAX_ORDER_QUANTITY) =>
  Math.min(stock ?? 0, getEffectiveLimit(maxOrderQuantity));

export const validateQuantity = ({ quantity, stock, maxOrderQuantity = DEFAULT_MAX_ORDER_QUANTITY }) =>
  buildQuantityValidationResult((quantity ?? 0) + 1, stock, maxOrderQuantity);

export const validateCartQuantity = (requestedQuantity, stock, maxOrderQuantity = DEFAULT_MAX_ORDER_QUANTITY) => {
  if (requestedQuantity < 1) {
    return { valid: false, reason: 'MIN_QUANTITY', message: null };
  }

  return buildQuantityValidationResult(requestedQuantity, stock, maxOrderQuantity);
};

export const isAtQuantityLimit = (currentQuantity, stock, maxOrderQuantity = DEFAULT_MAX_ORDER_QUANTITY) =>
  currentQuantity >= getQuantityLimit(stock, maxOrderQuantity);
