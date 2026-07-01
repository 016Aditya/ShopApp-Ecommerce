/**
 * ProductCard.jsx
 *
 * Fix: Removed role="button" + onClick from the outer wrapper <div>.
 * The entire card was a single giant button, which caused the card's
 * goToDetail onClick to fire when the user clicked "ADD TO CART" —
 * navigating away before onSuccess could trigger the toast.
 *
 * Solution: only the inner .card-clickable section (image + info) is
 * navigable. The Add to Cart button sits outside that area and has no
 * parent click handler to bubble into.
 */
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate }   from 'react-router-dom';
import PATHS, { buildPath } from '@/routes/paths';
import { useAuth }       from '@/features/auth/hooks/useAuth';
import { useAddToCart }  from '@/features/cart/hooks/useCart';
import { formatCurrency } from '@/utils/currency';
import RatingBadge       from '@/components/common/RatingBadge';
import { usePrefetchProductDetail } from '@/hooks/useQueryProducts';
import WishlistHeart     from '@/components/WishlistHeart';
import CartToast         from '@/components/CartToast';

const ProductCard = memo(({ product, compact = false }) => {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const [showToast, setShowToast] = useState(false);
  const cardRef                   = useRef(null);
  const prefetch                  = usePrefetchProductDetail();

  const addToCartMutation = useAddToCart();
  const busy = addToCartMutation.isPending;

  // ── Mobile prefetch via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (!isTouchDevice) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          prefetch(product.id);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const goToDetail = () => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id));

  const handleAddToCart = (e) => {
    // Belt-and-suspenders: stop the click from reaching any parent
    e.stopPropagation();
    e.preventDefault();
    if (!user) { navigate(PATHS.LOGIN); return; }
    if (busy || product.inStock === false) return;

    addToCartMutation.mutate(
      { product, quantity: 1 },
      {
        onSuccess: () => {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        },
      }
    );
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // ── Button helpers ──────────────────────────────────────────────────────
  const btnLabel = () => {
    if (product.inStock === false) return 'OUT OF STOCK';
    if (busy) return 'Adding...';
    return 'ADD TO CART';
  };

  const btnClass = () => {
    const base = 'w-full rounded-sm py-2 text-sm font-bold transition active:scale-95 ';
    if (product.inStock === false) return base + 'bg-gray-400 cursor-not-allowed text-white';
    if (busy) return base + 'bg-[#ff9f00]/70 cursor-not-allowed text-white';
    return base + 'bg-[#ff9f00] hover:bg-[#e08e00] text-white';
  };

  /* ─── COMPACT variant ─── */
  if (compact) {
    return (
      <>
        {/* Outer div: NO onClick, NO role=button — it is purely a layout container */}
        <div
          ref={cardRef}
          className="group flex flex-col items-center rounded-sm border p-3 hover:shadow-md transition"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          {/* Clickable area: image + name + price */}
          <div
            className="w-full cursor-pointer"
            onClick={goToDetail}
            onMouseEnter={() => prefetch(product.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && goToDetail()}
          >
            <div
              className="relative flex w-full items-center justify-center overflow-hidden rounded mb-2"
              style={{
                aspectRatio: '1 / 1',
                padding: '8px',
                background: 'linear-gradient(135deg, var(--featured-image-start) 0%, var(--featured-image-end) 100%)',
                borderRadius: '8px',
              }}
            >
              {discount ? (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                  {discount}% OFF
                </div>
              ) : null}

              <WishlistHeart productId={product.id} productName={product.name} />

              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  width={200}
                  height={200}
                  decoding="async"
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 220ms ease' }}
                  className="group-hover:scale-[1.04]"
                />
              ) : (
                <span className="text-4xl">🛍️</span>
              )}
            </div>

            <p
              className="text-center line-clamp-2 group-hover:text-[#2874f0] transition"
              style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.4, color: 'var(--text-primary)' }}
            >
              {product.name}
            </p>
            <div className="mt-1 w-full">
              <RatingBadge rating={product.averageRating || 0} count={product.reviewCount || 0} showCount={false} />
            </div>
            <p className="mt-1 font-bold" style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>
              {formatCurrency(product.price)}
            </p>
          </div>

          {/* Add to Cart button — completely outside the clickable area */}
          <button
            className={btnClass()}
            style={{ marginTop: '8px' }}
            onClick={handleAddToCart}
            disabled={busy || product.inStock === false}
            aria-label={`Add ${product.name} to cart`}
          >
            {btnLabel()}
          </button>
        </div>

        <CartToast visible={showToast} />
      </>
    );
  }

  /* ─── STANDARD grid card ─── */
  return (
    <>
      {/* Outer div: NO onClick, NO role=button — layout container only */}
      <div
        ref={cardRef}
        className="group flex flex-col rounded-sm border shadow-sm transition hover:shadow-md"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        {/* Clickable area: image + info */}
        <div
          className="flex flex-1 flex-col cursor-pointer"
          onClick={goToDetail}
          onMouseEnter={() => prefetch(product.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && goToDetail()}
        >
          <div
            className="relative flex w-full items-center justify-center overflow-hidden"
            style={{
              aspectRatio: '1 / 1',
              margin: '7px',
              width: 'calc(100% - 14px)',
              borderRadius: '8px',
              padding: '8px',
              background: 'linear-gradient(135deg, var(--featured-image-start) 0%, var(--featured-image-end) 100%)',
            }}
          >
            {discount ? (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
                {discount}% OFF
              </div>
            ) : null}

            <WishlistHeart productId={product.id} productName={product.name} />

            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                width={300}
                height={300}
                decoding="async"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 220ms ease' }}
                className="group-hover:scale-[1.04]"
              />
            ) : (
              <span className="text-6xl">🛍️</span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-1 p-3">
            <h3
              className="line-clamp-2 group-hover:text-[#2874f0] transition"
              style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.4, color: 'var(--text-primary)' }}
            >
              {product.name}
            </h3>

            <div className="mt-0.5">
              <RatingBadge rating={product.averageRating || 0} count={product.reviewCount || 0} />
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>
                {formatCurrency(product.price)}
              </p>
              {product.originalPrice && product.originalPrice > product.price ? (
                <p className="text-xs line-through" style={{ color: 'var(--text-tertiary)' }}>
                  {formatCurrency(product.originalPrice)}
                </p>
              ) : null}
            </div>

            <p className="text-xs font-semibold text-green-500">✓ Free Delivery</p>

            {product.inStock === false ? (
              <p className="text-xs font-semibold text-red-500">Out of Stock</p>
            ) : null}

            <div className="flex items-center gap-1 flex-wrap">
              <span
                className="w-fit rounded-full px-2 py-0.5"
                style={{ fontSize: '13px', color: 'var(--text-secondary)', backgroundColor: 'var(--badge-bg)' }}
              >
                {product.category}
              </span>
              {product.subcategory ? (
                <span
                  className="w-fit rounded-full px-2 py-0.5"
                  style={{ fontSize: '10px', color: 'var(--text-secondary)', backgroundColor: 'var(--badge-bg)' }}
                >
                  {product.subcategory}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Add to Cart button — completely outside the clickable area, never bubbles to goToDetail */}
        <div className="px-3 pb-3">
          <button
            className={btnClass()}
            onClick={handleAddToCart}
            disabled={busy || product.inStock === false}
            aria-label={`Add ${product.name} to cart`}
          >
            {btnLabel()}
          </button>
        </div>
      </div>

      <CartToast visible={showToast} />
    </>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
