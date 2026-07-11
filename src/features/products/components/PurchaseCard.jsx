/**
 * PurchaseCard.jsx
 *
 * Updated for premium Add-to-Cart UX:
 * - Accepts `isInCart` boolean prop.
 * - Add to Cart button turns green ("✓ Added to Cart") when isInCart=true.
 * - Smooth 250ms transition — no layout shift.
 */
import { formatCurrencyTrimmed } from "@/utils/currency";

const PurchaseCard = ({
  product,
  onAddToCart,
  onBuyNow,
  addingToCart = false,
  buyingNow    = false,
  isInCart     = false,
}) => {
  const outOfStock = product.inStock === false;

  // ── Add to Cart button state ──────────────────────────────────────────────
  const cartBtnDisabled = outOfStock || addingToCart || buyingNow;

  const cartBtnStyle = () => {
    if (outOfStock)  return { background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' };
    if (addingToCart) return { background: '#86efac', color: '#fff' };
    if (isInCart)      return { background: '#22c55e', color: '#fff' };
    return { background: 'var(--accent, #ff9f00)', color: '#fff' };
  };

  const cartBtnLabel = () => {
    if (outOfStock)   return 'OUT OF STOCK';
    if (addingToCart) return (
      <span className="flex items-center justify-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate"
              from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" />
          </path>
        </svg>
        Adding…
      </span>
    );
    if (isInCart) return '\u2713 Added to Cart';
    return 'ADD TO CART';
  };

  return (
    <div
      className="purchase-card rounded-lg p-4"
      style={{
        border: '1px solid var(--border-color)',
        background: 'var(--card-bg)',
        position: 'sticky',
        top: 80,
      }}
    >
      {/* Price */}
      <div className="mb-3">
        <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          {formatCurrencyTrimmed(Number(product.price))}
        </span>
        
        {/* FIXED BUG HERE: Replaced 'product.originalPrice && ...' to prevent a stray "0" */}
        {product.originalPrice > product.price && (
          <>
            <span className="ml-2 text-sm line-through" style={{ color: 'var(--text-tertiary)' }}>
              {formatCurrencyTrimmed(product.originalPrice)}
            </span>
            <span className="ml-2 text-sm font-semibold text-green-500">
              {Math.round(
                ((product.originalPrice - product.price) / product.originalPrice) * 100
              )}% off
            </span>
          </>
        )}
      </div>

      {/* Delivery & stock */}
      <p className="mb-1 text-sm text-green-500 font-medium">✓ Free Delivery</p>
      {outOfStock ? (
        <p className="mb-3 text-sm font-semibold text-red-500">Out of Stock</p>
      ) : (
        <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          In Stock — ships within 2 days
        </p>
      )}

      {/* Add to Cart */}
      <button
        className="mb-2 w-full rounded py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70 active:scale-95"
        style={{
          ...cartBtnStyle(),
          transition: 'background 250ms ease, color 250ms ease',
        }}
        onClick={onAddToCart}
        disabled={cartBtnDisabled}
        aria-label={isInCart ? 'Product already in cart' : 'Add to cart'}
      >
        {cartBtnLabel()}
      </button>

      {/* Buy Now */}
      <button
        className="w-full rounded py-2.5 text-sm font-bold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        style={{
          background: outOfStock ? 'var(--bg-tertiary)' : '#fb8c00',
          color: outOfStock ? 'var(--text-tertiary)' : '#fff',
        }}
        onClick={onBuyNow}
        disabled={outOfStock || addingToCart || buyingNow}
        aria-label="Buy now"
      >
        {buyingNow ? (
          <span className="flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate"
                  from="0 12 12" to="360 12 12" dur="0.7s" repeatCount="indefinite" />
              </path>
            </svg>
            Processing…
          </span>
        ) : outOfStock ? 'UNAVAILABLE' : 'BUY NOW'}
      </button>

      <div
        className="mt-3 flex items-center gap-2 text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span aria-hidden="true">🔒</span>
        <span>Secure checkout</span>
      </div>
    </div>
  );
};

export default PurchaseCard;