import { useState }        from 'react';
import { useNavigate }     from 'react-router-dom';
import { useAuth }         from '@/features/auth/hooks/useAuth';
import { useAddToCart }    from '@/features/cart/hooks/useCart';
import { buildPath }       from '@/routes/paths';
import PATHS               from '@/routes/paths';
import { formatCurrency }  from '@/utils/currency';
import {
  useWishlistQuery,
  useRemoveFromWishlist,
} from '@/features/wishlist/hooks/useWishlist';
import './styles/Wishlist.css';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: items = [], isLoading, isError } = useWishlistQuery();
  const removeMutation    = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const [movingId,   setMovingId]   = useState(null);
  const [removingId, setRemovingId] = useState(null);

  if (!user) { navigate(PATHS.LOGIN); return null; }

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try   { await removeMutation.mutateAsync({ productId }); }
    finally { setRemovingId(null); }
  };

  const handleMoveToCart = async (item) => {
    setMovingId(item.productId);
    try {
      // 1. Add to cart
      await addToCartMutation.mutateAsync({
        product: {
          id:       item.productId,
          name:     item.productName,
          imageUrl: item.imageUrl,
          brand:    item.brand,
          category: item.category,
          price:    item.unitPrice,
        },
        quantity: 1,
      });
      // 2. Remove from wishlist — auto-invalidates wishlist cache
      await removeMutation.mutateAsync({ productId: item.productId });
    } finally {
      setMovingId(null);
    }
  };

  if (isLoading) return <div className="wl-center"><p>Loading your wishlist…</p></div>;
  if (isError)   return (
    <div className="wl-center">
      <p className="wl-error-msg">Failed to load wishlist.</p>
      <button className="wl-btn-primary" onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  if (!items.length) return (
    <div className="wl-center">
      <div className="wl-empty-icon">💔</div>
      <p className="wl-empty-title">Your wishlist is empty</p>
      <p className="wl-empty-sub">Save items you love and come back to them anytime.</p>
      <button className="wl-btn-primary" onClick={() => navigate(PATHS.PRODUCTS)}>Browse Products</button>
    </div>
  );

  return (
    <div className="wl-page">
      <p className="wl-count">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>

      <div className="wl-list">
        {items.map((item) => {
          const isMoving   = movingId   === item.productId;
          const isRemoving = removingId === item.productId;
          const busy = isMoving || isRemoving;

          return (
            <div key={item.productId} className={`wl-row ${busy ? 'wl-row--busy' : ''}`}>

              <div className="wl-img-wrap"
                onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, item.productId))}
                role="button" tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(buildPath(PATHS.PRODUCT_DETAIL, item.productId))}
              >
                <img src={item.imageUrl || '/placeholder-product.png'}
                  alt={item.productName} loading="lazy" width="130" height="130" />
              </div>

              <div className="wl-info">
                <div className="wl-meta">
                  {item.brand    && <span className="wl-brand">{item.brand}</span>}
                  {item.category && <span className="wl-category">{item.category}</span>}
                </div>
                <p className="wl-name"
                  onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, item.productId))}
                  role="button" tabIndex={0}>
                  {item.productName}
                </p>
                <p className="wl-price">{formatCurrency(item.unitPrice)}</p>
              </div>

              <div className="wl-actions">
                <button className="wl-btn-move"
                  onClick={() => handleMoveToCart(item)} disabled={busy}>
                  {isMoving ? 'Moving…' : 'Move to Cart'}
                </button>
                <button className="wl-btn-remove"
                  onClick={() => handleRemove(item.productId)} disabled={busy}>
                  {isRemoving ? 'Removing…' : 'Remove'}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
