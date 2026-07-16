import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useToastStore } from '@/store/toastStore';
import AppToast from '@/components/AppToast';
import PATHS from '@/routes/paths';

const CART_CONFIG = {
  bottomOffset: '28px',
};

const WISHLIST_BOTTOM_OFFSET = '88px';

const CartAction = () => {
  const navigate = useNavigate();

  return (
    <button
      className="app-toast__action"
      onClick={() => navigate(PATHS.CART)}
      aria-label="View cart"
    >
      View Cart {'->'}
    </button>
  );
};

const CartToastPortal = () => {
  const cartVisible = useToastStore((s) => s.cartVisible);
  const cartToast = useToastStore((s) => s.cartToast);
  const wishlistVisible = useToastStore((s) => s.wishlistVisible);
  const wishlistToast = useToastStore((s) => s.wishlistToast);

  return ReactDOM.createPortal(
    <>
      <AppToast
        visible={cartVisible}
        type={cartToast.type}
        title={cartToast.title}
        message={cartToast.message}
        action={cartToast.action === 'view-cart' ? <CartAction /> : null}
        bottomOffset={CART_CONFIG.bottomOffset}
      />

      <AppToast
        visible={wishlistVisible}
        type={wishlistToast.type}
        title={wishlistToast.title}
        message={wishlistToast.message}
        bottomOffset={WISHLIST_BOTTOM_OFFSET}
      />
    </>,
    document.body
  );
};

export default CartToastPortal;
