import { useState, useEffect } from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '@/features/auth/hooks/useAuth';
import { useCartStore }        from '@/store';
import { buildPath }           from '@/routes/paths';
import PATHS                   from '@/routes/paths';
import { formatCurrency }      from '@/utils/currency';
import { useWishlistStore }    from '@/store/wishlistStore';

/**
 * WishlistPage
 *
 * Reads wishlist items from Zustand (useWishlistStore).
 * Renders a grid of saved products with Remove + Add-to-Cart actions.
 */
const WishlistPage = () => {
  const navigate            = useNavigate();
  const { user }            = useAuth();
  const items               = useWishlistStore((s) => s.items);
  const removeFromWishlist  = useWishlistStore((s) => s.removeItem);
  const [addingId, setAddingId] = useState(null);

  // Redirect guests
  useEffect(() => {
    if (!user) navigate(PATHS.LOGIN);
  }, [user, navigate]);

  const handleAddToCart = async (product) => {
    setAddingId(product.id);
    try {
      await useCartStore.getState().addToCart(product, 1);
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
        {items.map((product) => (
          <div
            key={product.id}
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
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', cursor: 'pointer' }}
                onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
                loading="lazy"
              />
            )}

            {/* Name */}
            <p
              style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4, cursor: 'pointer' }}
              onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, product.id))}
            >
              {product.name}
            </p>

            {/* Price */}
            <p style={{ color: '#22c55e', fontWeight: 700 }}>{formatCurrency(product.price)}</p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button
                style={{
                  flex: 1,
                  padding: '8px',
                  background: addingId === product.id ? '#ccc' : '#ff9f00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: addingId === product.id ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
                onClick={() => handleAddToCart(product)}
                disabled={addingId === product.id}
              >
                {addingId === product.id ? 'Adding…' : 'Add to Cart'}
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
                onClick={() => removeFromWishlist(product.id)}
                aria-label={`Remove ${product.name} from wishlist`}
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
