/**
 * CartToast.jsx
 *
 * Reusable floating green pill that appears at the bottom-center of the
 * screen after a successful Add to Cart action.
 *
 * Usage:
 *   const [showToast, setShowToast] = useState(false);
 *
 *   // trigger:
 *   setShowToast(true);
 *   setTimeout(() => setShowToast(false), 2500);
 *
 *   // render:
 *   <CartToast visible={showToast} />
 *
 * The component renders nothing when visible=false, so it is safe to
 * always include it in the JSX without wrapping in a conditional.
 */
import './CartToast.css';

const CartToast = ({ visible, message = '\u2713 Added to cart! \uD83D\uDED2' }) => {
  if (!visible) return null;
  return (
    <div className="cart-toast" role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default CartToast;
