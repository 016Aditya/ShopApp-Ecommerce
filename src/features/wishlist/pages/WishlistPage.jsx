import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/utils/currency";
import PATHS from "@/routes/paths";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const items = useWishlistStore((s) => s.items);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);

  const handleMoveToCart = async (item) => {
    if (!user) { navigate(PATHS.LOGIN); return; }
    await useCartStore.getState().addToCart(
      {
        id: item.productId,
        name: item.productName,
        imageUrl: item.imageUrl,
        brand: item.brand,
        category: item.category,
        price: item.unitPrice,
      },
      1
    );
    removeFromWishlist(item.productId);
  };

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>My Wishlist</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>
          {items.length} saved item{items.length !== 1 ? "s" : ""}
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🤍</span>
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>No Saved Items Yet</h2>
            <p className="mb-6" style={{ color: "var(--text-secondary)" }}>Items you save for later will appear here.</p>
            <button
              onClick={() => navigate(PATHS.PRODUCTS)}
              className="font-bold py-3 px-8 rounded transition"
              style={{ background: "var(--button-primary)", color: "var(--button-primary-text)" }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="rounded-lg shadow-sm p-4 flex gap-4 items-center"
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-color)",
                  transition: "background 300ms ease, border-color 300ms ease",
                }}
              >
                {/* Image */}
                <div
                  className="flex-shrink-0 h-20 w-20 rounded overflow-hidden"
                  style={{
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-2xl">🛍️</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 mb-1">
                    {item.brand && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded"
                        style={{ background: "var(--badge-bg)", color: "var(--badge-text)" }}
                      >
                        {item.brand}
                      </span>
                    )}
                    {item.category && (
                      <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{item.category}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold line-clamp-2 mb-1" style={{ color: "var(--text-primary)" }}>
                    {item.productName}
                  </h3>
                  <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="text-sm font-bold px-4 py-2 rounded transition whitespace-nowrap"
                    style={{ background: "var(--button-primary)", color: "var(--button-primary-text)" }}
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="text-sm font-medium transition text-center"
                    style={{ color: "var(--error-text)" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
