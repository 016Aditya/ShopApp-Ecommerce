/**
 * CartToast.jsx — Premium animated Add-to-Cart notification
 *
 * Rendered exclusively through CartToastPortal (which portals it to
 * document.body). Never render this component directly inside a page
 * or feature component — use toastStore.showCartToast() instead.
 *
 * Animation states:
 *   visible=true  → show=true, animOut=false  → cart-toast-in keyframe
 *   visible=false → animOut=true              → cart-toast-out keyframe (260ms)
 *                 → show=false               → null (DOM removed)
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PATHS from '@/routes/paths';
import './CartToast.css';

const CartToast = ({ visible }) => {
  const navigate = useNavigate();
  const [show, setShow]       = useState(false);
  const [animOut, setAnimOut] = useState(false);
  const timerRef              = useRef(null);

  useEffect(() => {
    if (visible) {
      clearTimeout(timerRef.current);
      setAnimOut(false);
      setShow(true);
    } else if (show) {
      setAnimOut(true);
      timerRef.current = setTimeout(() => {
        setShow(false);
        setAnimOut(false);
      }, 260);
    }
    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!show) return null;

  return (
    <div
      className={`cart-toast${animOut ? ' cart-toast--out' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="cart-toast__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="cart-toast__text">Added to Cart!</span>
      <button
        className="cart-toast__action"
        onClick={() => navigate(PATHS.CART)}
        aria-label="View cart"
      >
        View Cart →
      </button>
    </div>
  );
};

export default CartToast;
