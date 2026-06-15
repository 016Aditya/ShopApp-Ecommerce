import useCart from "../hooks/useCart";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatCurrency } from "@/utils/currency";

const CartItem = ({ item }) => {
  const { updateItem, removeItem } = useCart();
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);

  // Backend CartItem shape: { productId, quantity, unitPrice }
  // Enriched shape (from cartStore): adds productName, imageUrl, brand, category
  const {
    productId,
    productName,
    brand,
    category,
    unitPrice,   // ← correct backend field (was wrongly mapped to 'price')
    quantity,
    imageUrl,    // ← correct field (was 'image')
  } = item;

  const price    = unitPrice ?? 0;
  const subtotal = price * (quantity ?? 1);

  const handleSaveForLater = () => {
    addToWishlist({
      productId,
      productName,
      imageUrl,
      brand,
      category,
      unitPrice: price,
    });
    removeItem(productId);
  };

  return (
    <div className="flex gap-4 border-b border-gray-200 py-4 sm:gap-6 sm:py-6">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="h-24 w-24 bg-gray-100 rounded border border-gray-200 flex items-center justify-center overflow-hidden sm:h-32 sm:w-32">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productName || 'Product'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex-1">
          {/* Brand and Category */}
          <div className="flex gap-2 mb-1">
            {brand && (
              <span className="inline-block text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {brand}
              </span>
            )}
            {category && (
              <span className="inline-block text-xs text-gray-500 px-2 py-1">
                {category}
              </span>
            )}
          </div>

          {/* Product Name — never show raw ID */}
          <h3 className="text-base font-semibold text-gray-900 leading-tight mb-2 line-clamp-2">
            {productName || 'Loading product...'}
          </h3>

          {/* Price */}
          <p className="text-lg font-bold text-gray-900 mb-3">
            {formatCurrency(price)}
            <span className="text-xs font-normal text-gray-600 ml-2">per item</span>
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => updateItem(productId, Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-4 py-2 font-semibold text-gray-900 min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => updateItem(productId, quantity + 1)}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(subtotal)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex gap-3">
          <button
            onClick={handleSaveForLater}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
          >
            Save for Later
          </button>
          <button
            onClick={() => removeItem(productId)}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
