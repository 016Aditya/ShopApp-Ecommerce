/**
 * ProductDetail.jsx
 *
 * Quantity stepper for the Product Detail page.
 *
 * Responsibilities:
 *   - Render a +/- quantity selector above the Add-to-Cart / Buy-Now buttons.
 *   - Validate every increment attempt via the shared validateQuantity() utility.
 *   - Fire a contextual toast when the user tries to exceed stock or the
 *     purchase limit — same messages as CartItem.jsx for consistency.
 *   - Never mutate the quantity if validation fails.
 *   - Expose the selected quantity to the parent via the onQuantityChange prop
 *     so PurchaseCard (or the parent page) can send the correct qty to the API.
 *
 * This component is a pure UX enhancement.
 * No backend code, inventory logic, or API calls live here.
 */
import { useState }              from 'react';
import { useToastStore }         from '@/store/toastStore';
import { validateQuantity, isAtQuantityLimit } from '../../../features/cart/utils/cartValidation';

/**
 * @param {object}   props
 * @param {object}   props.product          - Full product object from the API
 * @param {Function} props.onQuantityChange - Called with the new qty whenever it changes
 * @param {number}   [props.initialQty=1]   - Starting quantity (default 1)
 */
const ProductDetail = ({ product, onQuantityChange, initialQty = 1 }) => {
  const [quantity, setQuantity] = useState(initialQty);
  const showToast = useToastStore((s) => s.showToast);

  const stock            = product?.stock           ?? 0;
  const maxOrderQuantity = product?.maxOrderQuantity ?? 10;

  // ── Increment ──────────────────────────────────────────────────────────────
  const handleIncrement = () => {
    const validation = validateQuantity({ quantity, stock, maxOrderQuantity });

    if (!validation.valid) {
      showToast({
        type: 'warning',
        title: validation.title,
        message: validation.message,
      });
      return;
    }

    const next = quantity + 1;
    setQuantity(next);
    onQuantityChange?.(next);
  };

  // ── Decrement ──────────────────────────────────────────────────────────────
  const handleDecrement = () => {
    if (quantity <= 1) return;
    const next = quantity - 1;
    setQuantity(next);
    onQuantityChange?.(next);
  };

  const atLimit = isAtQuantityLimit(quantity, stock, maxOrderQuantity);

  return (
    <div className="flex items-center gap-3 my-3">
      <span className="text-sm font-medium text-gray-700">Qty:</span>

      <div className="flex items-center border border-gray-300 rounded-lg">
        {/* Decrement */}
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Decrease quantity"
        >
          −
        </button>

        {/* Display */}
        <span className="px-4 py-2 font-semibold text-gray-900 min-w-[40px] text-center">
          {quantity}
        </span>

        {/* Increment */}
        <button
          onClick={handleIncrement}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Increase quantity"
          title={
            atLimit
              ? (stock === quantity
                  ? `Only ${stock} items available.`
                  : `Maximum ${maxOrderQuantity} items allowed.`)
              : undefined
          }
        >
          +
        </button>
      </div>

      {/* Contextual stock hint */}
      {stock > 0 && stock <= 5 && (
        <span className="text-xs text-amber-600 font-medium">
          Only {stock} left!
        </span>
      )}
    </div>
  );
};

export default ProductDetail;
