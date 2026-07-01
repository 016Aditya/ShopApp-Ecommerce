/**
 * CartToastPortal.jsx — Single global toast renderer
 *
 * Mounted ONCE in App.jsx. Renders ALL app-level toasts (cart +
 * wishlist) via ReactDOM.createPortal directly into document.body,
 * completely escaping any CSS stacking context, overflow:hidden, or
 * transform on ancestor elements.
 *
 * Two AppToast instances are stacked vertically:
 *   • Cart toast     — bottom: 28px  (always lowest)
 *   • Wishlist toast — bottom: 88px  (60px above cart toast)
 *
 * Both can be visible simultaneously without overlapping.
 */
import ReactDOM from 'react-dom';
import { useNavigate }   from 'react-router-dom';
import { useToastStore } from '@/store/toastStore';
import AppToast          from '@/components/AppToast';
import PATHS             from '@/routes/paths';

// ── Cart toast config ────────────────────────────────────────────────────────
const CART_CONFIG = {
  bgColor:      '#22c55e',
  shadowColor:  'rgba(34, 197, 94, 0.45)',
  bottomOffset: '28px',
};

// ── Wishlist toast config ────────────────────────────────────────────────────
const WISHLIST_ADD_CONFIG = {
  message:      '\u2764\ufe0f Added to Wishlist!',
  bgColor:      '#f43f5e',
  shadowColor:  'rgba(244, 63, 94, 0.45)',
  bottomOffset: '88px',
};

const WISHLIST_REMOVE_CONFIG = {
  message:      '\ud83d\udc94 Removed from Wishlist',
  bgColor:      '#6b7280',
  shadowColor:  'rgba(107, 114, 128, 0.40)',
  bottomOffset: '88px',
};

// ── Cart action button ───────────────────────────────────────────────────────
const CartAction = () => {
  const navigate = useNavigate();
  return (
    <button
      className="app-toast__action"
      onClick={() => navigate(PATHS.CART)}
      aria-label="View cart"
    >
      View Cart \u2192
    </button>
  );
};

// ── Cart icon ────────────────────────────────────────────────────────────────
const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Portal ───────────────────────────────────────────────────────────────────
const CartToastPortal = () => {
  const cartVisible     = useToastStore((s) => s.cartVisible);
  const wishlistVisible = useToastStore((s) => s.wishlistVisible);
  const wishlistType    = useToastStore((s) => s.wishlistType);

  const wishlistConfig = wishlistType === 'remove'
    ? WISHLIST_REMOVE_CONFIG
    : WISHLIST_ADD_CONFIG;

  return ReactDOM.createPortal(
    <>
      {/* Cart toast — lower position */}
      <AppToast
        visible={cartVisible}
        message="\u2713 Added to Cart!"
        icon={<CartIcon />}
        action={<CartAction />}
        bgColor={CART_CONFIG.bgColor}
        shadowColor={CART_CONFIG.shadowColor}
        bottomOffset={CART_CONFIG.bottomOffset}
      />

      {/* Wishlist toast — 60px above cart toast so they never overlap */}
      <AppToast
        visible={wishlistVisible}
        message={wishlistConfig.message}
        bgColor={wishlistConfig.bgColor}
        shadowColor={wishlistConfig.shadowColor}
        bottomOffset={wishlistConfig.bottomOffset}
      />
    </>,
    document.body
  );
};

export default CartToastPortal;
