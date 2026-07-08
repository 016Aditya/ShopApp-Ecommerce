// ─── Currency formatting ──────────────────────────────────────────────────────
// Your backend stores prices as plain numbers (e.g. 499.99).
// All display formatting lives here — change the locale/currency in one place.

const DEFAULT_LOCALE = "en-IN";           // Indian locale — ₹1,499.00
const DEFAULT_CURRENCY = "INR";


/**
 * Formats a number as a currency string.
 * formatCurrency(1499.9)  → "₹1,499.90"
 * formatCurrency(0)       → "₹0.00"
 * formatCurrency(null)    → "₹0.00"
 */
export function formatCurrency(
  amount,
  locale = DEFAULT_LOCALE,
  currency = DEFAULT_CURRENCY
) {
  const safeAmount = Number(amount) || 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}

/**
 * Formats a number as a currency string and removes redundant ".00" for whole values.
 * formatCurrencyTrimmed(1499.9) → "₹1,499.90"
 * formatCurrencyTrimmed(1499)   → "₹1,499"
 */
export function formatCurrencyTrimmed(
  amount,
  locale = DEFAULT_LOCALE,
  currency = DEFAULT_CURRENCY
) {
  const safeAmount = Number(amount) || 0;
  const hasFraction = Math.round((safeAmount % 1) * 100) !== 0;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}

/**
 * Formats a number as a compact currency string.
 * formatCurrencyCompact(149900) → "₹1.5L"
 */
export function formatCurrencyCompact(
  amount,
  locale = DEFAULT_LOCALE,
  currency = DEFAULT_CURRENCY
) {
  const safeAmount = Number(amount) || 0;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(safeAmount);
}

/**
 * Calculates the total price for a single cart item.
 * cartItemTotal({ unitPrice: 100, quantity: 3 }) → 300
 */
export function cartItemTotal(item) {
  return (Number(item?.unitPrice) || 0) * (Number(item?.quantity) || 0);
}

/**
 * Calculates total across all cart items client-side.
 * Use this as a fallback — the backend's cartTotal field is the source of truth.
 * cartItemsTotal([{ unitPrice: 100, quantity: 2 }, { unitPrice: 50, quantity: 1 }]) → 250
 */
export function cartItemsTotal(items = []) {
  return items.reduce((sum, item) => sum + cartItemTotal(item), 0);
}

/**
 * Parses a raw backend price string or number into a float.
 * parsePrice("1,499.99") → 1499.99
 * parsePrice(499)        → 499
 */
export function parsePrice(value) {
  if (typeof value === "number") return value;
  return parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
}