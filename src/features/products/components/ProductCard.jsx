/**
 * ProductCard.jsx
 *
 * Changes in this update:
 *   - Injected <WishlistHeart> into the image container of both
 *     COMPACT and STANDARD card variants.
 *   - WishlistHeart sits at top-right inside the image area.
 *   - The discount badge (top-right) is repositioned to top-left
 *     so it never overlaps the heart icon.
 *   - ProductDetailPage is NOT affected — WishlistHeart is only
 *     rendered from ProductCard.
 *
 * All existing logic (prefetch, add-to-cart, discount, rating,
 * IntersectionObserver, keyboard nav) is unchanged.
 */
import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate }   from 'react-router-dom';
import PATHS, { buildPath } from '@/routes/paths';
import { useCartStore }  from '@/store';
import { useAuth }       from '@/features/auth/hooks/useAuth';
import { formatCurrency } from '@/utils/currency';
import RatingBadge       from '@/components/common/RatingBadge';
import { usePrefetchProductDetail } from '@/hooks/useQueryProducts';
import WishlistHeart     from '@/components/WishlistHeart';

const ProductCard = memo(({ product, compact = false }) => {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const [added, setAdded] = useState(false);
  const [busy, setBusy]   = useState(false);
  const cardRef           = useRef(null);
  const prefetch          = usePrefetchProductDetail();

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

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) { navigate(PATHS.LOGIN); return; }
    setBusy(true);
    try {
      await useCartStore.getState().addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setBusy(false);
    }
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const goToDetail = () => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id));

  /* ─── COMPACT variant ─── */
  if (compact) {
    return (
      <div
        ref={cardRef}
        className="group flex cursor-pointer flex-col items-center rounded-sm border p-3 hover:shadow-md transition"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        onClick={goToDetail}
        onMouseEnter={() => prefetch(product.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && goToDetail()}
      >
        {/* Image container — position:relative for heart + badge */}
        <div
          className="relative flex w-full items-center justify-center overflow-hidden rounded mb-2"
          style={{
            aspectRatio: '1 / 1',
            padding: '8px',
            background: 'linear-gradient(135deg, var(--featured-image-start) 0%, var(--featured-image-end) 100%)',
            borderRadius: '8px',
          }}
        >
          {/* Discount badge — moved to top-LEFT to avoid heart overlap */}
          {discount ? (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
              {discount}% OFF
            </div>
          ) : null}

          {/* ── Wishlist heart ── */}
          <WishlistHeart productId={product.id} productName={product.name} />

          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              width={200}
              height={200}
              decoding="async"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                transition: 'transform 220ms ease',
              }}
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
    );
  }

  /* ─── STANDARD grid card ─── */
  return (
    <div
      ref={cardRef}
      className="group flex cursor-pointer flex-col rounded-sm border shadow-sm transition hover:shadow-md"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      onClick={goToDetail}
      onMouseEnter={() => prefetch(product.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && goToDetail()}
    >
      {/* Image container — position:relative for heart + badge */}
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
        {/* Discount badge — top-LEFT to avoid heart overlap */}
        {discount ? (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
            {discount}% OFF
          </div>
        ) : null}

        {/* ── Wishlist heart ── */}
        <WishlistHeart productId={product.id} productName={product.name} />

        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            width={300}
            height={300}
            decoding="async"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'transform 220ms ease',
            }}
            className="group-hover:scale-[1.04]"
          />
        ) : (
          <span className="text-6xl">🛍️</span>
        )}
      </div>

      {/* Product info */}
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

      {/* Add to Cart */}
      <div className="px-3 pb-3">
        <button
          className={`w-full rounded-sm py-2 text-sm font-bold text-white transition active:scale-95 ${
            added ? 'bg-green-600'
            : busy ? 'bg-[#ff9f00]/70 cursor-not-allowed'
            : product.inStock === false ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#ff9f00] hover:bg-[#e08e00]'
          }`}
          onClick={handleAddToCart}
          disabled={busy || product.inStock === false}
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? '✓ Added!' : busy ? 'Adding...' : product.inStock === false ? 'OUT OF STOCK' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
