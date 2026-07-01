/**
 * CartToast.jsx — Premium animated Add-to-Cart notification
 *
 * Features:
 *  - Animate-in: fade + translateY(20px→0) + scale(0.95→1) over 250ms
 *  - Visible: holds for ~2 s (controlled by parent setTimeout)
 *  - Animate-out: fade + translateY(0→-12px) + scale(1→0.97) over 250ms
 *    Achieved by adding `.cart-toast--out` class 250ms before unmount,
 *    then parent sets visible=false.
 *  - "View Cart →" link navigates to cart
 *  - Mobile safe-area aware
 *  - pointer-events: none on pill except the View Cart button
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PATHS from '@/routes/paths';
import './CartToast.css';

const CartToast = ({ visible }) => {
  const navigate = useNavigate();
  // animOut drives the exit CSS class; we keep the DOM node alive 250ms
  // after visible flips to false so the animation can play.
  const [show, setShow]       = useState(false);
  const [animOut, setAnimOut] = useState(false);
  const timerRef              = useRef(null);

  useEffect(() => {
    if (visible) {
      setAnimOut(false);
      setShow(true);
    } else if (show) {
      // Start exit animation, then unmount after 250ms
      setAnimOut(true);
      timerRef.current = setTimeout(() => {
        setShow(false);
        setAnimOut(false);
      }, 260);
    }
    return () => clearTimeout(timerRef.current);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!show) return null;

  return (
    <div
      className={`cart-toast${animOut ? ' cart-toast--out' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="cart-toast__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
