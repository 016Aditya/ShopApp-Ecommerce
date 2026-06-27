import { useState }           from 'react';
import { useNavigate }         from 'react-router-dom';
import { useAuth }             from '@/features/auth/hooks/useAuth';
import { useAddToCart }        from '@/features/cart/hooks/useCart';
import { buildPath }           from '@/routes/paths';
import PATHS                   from '@/routes/paths';
import { formatCurrency }      from '@/utils/currency';
import {
  useWishlistQuery,
  useRemoveFromWishlist,
} from '@/features/wishlist/hooks/useWishlist';

/**
 * WishlistPage
 *
 * Server state now owned by TanStack Query via useWishlistQuery.
 * No more Zustand wishlist items — data is fetched from the backend
 * and cached/invalidated through useWishlist hooks.
 *
 * Item shape (normalized in useWishlistQuery's queryFn):
 *   { productId, productName, imageUrl, brand, category, unitPrice }
 */
const WishlistPage = () => {
  const navigate  = useNavigate();
  const { user }  = useAuth();

  // ── Server state (TanStack Query) ────────────────────────────────────────
  const { data: items = [], isLoading, isError } = useWishlistQuery();
  const removeMutation  = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  // ── Local UI state ───────────────────────────────────────────────────────
  const [addingId, setAddingId] = useState(null);

  // Guest guard — redirect to login
  if (!user) {
    navigate(PATHS.LOGIN);
    return null;
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleRemove = (productId) => {
    removeMutation.mutate({ productId });
  };

  const handleAddToCart = async (item) => {
    setAddingId(item.productId);
    try {
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

  // ── Loading / error states ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>Loading your wishlist…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#dc2626' }}>Failed to load wishlist. Please try again.</p>
        <button
          className="btn btn-primary"
          style={{ marginTop: '16px', background: '#2874f0', color: '#fff',
            padding: '10px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>💔 Your wishlist is empty.</p>
        <button
          className="btn btn-primary"
          style={{ background: '#2874f0', color: '#fff', padding: '10px 24px',
            borderRadius: '4px', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate(PATHS.PRODUCTS)}
        >
          Browse Products
        </button>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
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
            {/* Product image */}
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.productName}
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain', cursor: 'pointer' }}
                onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, item.productId))}
                loading="lazy"
                width="220"
                height="220"
              />
            )}

            {/* Product name */}
            <p
              style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.4, cursor: 'pointer' }}
              onClick={() => navigate(buildPath(PATHS.PRODUCT_DETAIL, item.productId))}
            >
              {item.productName}
            </p>

            {/* Price */}
            <p style={{ color: '#22c55e', fontWeight: 700 }}>
              {formatCurrency(item.unitPrice)}
            </p>

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
                  background: removeMutation.isPending ? '#f5f5f5' : '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: removeMutation.isPending ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
                onClick={() => handleRemove(item.productId)}
                disabled={removeMutation.isPending}
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
