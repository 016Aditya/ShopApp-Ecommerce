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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-sm text-gray-500 mb-6">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🤍</span>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Saved Items Yet</h2>
            <p className="text-gray-500 mb-6">Items you save for later will appear here.</p>
            <button
              onClick={() => navigate(PATHS.PRODUCTS)}
              className="bg-[#ff9f00] hover:bg-[#e08e00] text-white font-bold py-3 px-8 rounded transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex gap-4 items-center"
              >
                {/* Image */}
                <div className="flex-shrink-0 h-20 w-20 bg-gray-100 rounded border border-gray-200 overflow-hidden">
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
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        {item.brand}
                      </span>
                    )}
                    {item.category && (
                      <span className="text-xs text-gray-500">{item.category}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                    {item.productName}
                  </h3>
                  <p className="text-base font-bold text-gray-900">
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="bg-[#ff9f00] hover:bg-[#e08e00] text-white text-sm font-bold px-4 py-2 rounded transition whitespace-nowrap"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium transition text-center"
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
