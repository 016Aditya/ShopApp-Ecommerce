import { useState, useEffect }  from 'react';
import { useNavigate }          from 'react-router-dom';
import { useAuth }              from '@/features/auth/hooks/useAuth';
import { useAddToCart }         from '@/features/cart/hooks/useCart';
import { buildPath }            from '@/routes/paths';
import PATHS                    from '@/routes/paths';
import { formatCurrency }       from '@/utils/currency';
import { useWishlistStore }     from '@/store/wishlistStore';

/**
 * WishlistPage
 *
 * Reads wishlist items from Zustand (useWishlistStore).
 * Item shape: { productId, productName, imageUrl, brand, category, unitPrice }
 *
 * “Add to Cart” calls the TanStack Query useAddToCart mutation —
 * useCartStore.getState().addToCart() was removed in the cart refactor.
 */
const WishlistPage = () => {
  const navigate           = useNavigate();
  const { user }           = useAuth();
  const items              = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addToCartMutation  = useAddToCart();
  const [addingId, setAddingId] = useState(null);

  // Redirect guests
  useEffect(() => {
    if (!user) navigate(PATHS.LOGIN);
  }, [user, navigate]);

  const handleAddToCart = async (item) => {
    setAddingId(item.productId);
    try {
      // Reconstruct the minimal product shape useAddToCart expects
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
    } finally {
      setAddingId(null);
    }
  };

  if (!items.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>💔 Your wishlist is empty.</p>
        <button
          className="btn btn-primary"
          style={{ background: '#2874f0', color: '#fff', padding: '10px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate(PATHS.PRODUCTS)}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
        🖤 My Wishlist ({items.length})
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {items.map((item) => (
          <div
            key={item.productId}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '16px',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Image */}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.productName}
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', cursor: 'pointer' }}
                onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, item.productId))}
                loading="lazy"
              />
            )}

            {/* Name */}
            <p
              style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4, cursor: 'pointer' }}
              onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, item.productId))}
            >
              {item.productName}
            </p>

            {/* Price */}
            <p style={{ color: '#22c55e', fontWeight: 700 }}>{formatCurrency(item.unitPrice)}</p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  background: addingId === item.productId ? '#ccc' : '#ff9f00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: addingId === item.productId ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
                onClick={() => handleAddToCart(item)}
                disabled={addingId === item.productId}
              >
                {addingId === item.productId ? 'Adding…' : 'Add to Cart'}
              </button>
              <button
                style={{
                  padding: '8px 10px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
                onClick={() => removeFromWishlist(item.productId)}
                aria-label={`Remove ${item.productName} from wishlist`}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
