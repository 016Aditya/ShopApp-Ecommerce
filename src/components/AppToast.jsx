/**
 * AppToast.jsx — Generic animated floating pill toast
 *
 * Shared by CartToastPortal for both cart and wishlist notifications.
 * All styling comes from AppToast.css; colour is injected via CSS
 * custom properties so this component renders zero inline style logic.
 *
 * Props:
 *   visible     {boolean}  — controlled by toastStore
 *   message     {string}   — e.g. "✓ Added to Cart!"
 *   icon        {node}     — SVG or emoji span (optional)
 *   action      {node}     — e.g. <button>View Cart →</button> (optional)
 *   bgColor     {string}   — CSS color for --toast-bg
 *   shadowColor {string}   — CSS rgba string for --toast-shadow
 *   bottomOffset{string}   — CSS value, default '28px' (stacks toasts)
 */
import { useEffect, useRef, useState } from 'react';
import './AppToast.css';

const AppToast = ({
  visible,
  message,
  icon,
  action,
  bgColor     = '#22c55e',
  shadowColor = 'rgba(34, 197, 94, 0.45)',
  bottomOffset = '28px',
}) => {
  const [show,    setShow]    = useState(false);
  const [animOut, setAnimOut] = useState(false);
  const timerRef = useRef(null);

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
      className={`app-toast${animOut ? ' app-toast--out' : ''}`}
      role="status"
      aria-live="polite"
      style={{
        '--toast-bg':     bgColor,
        '--toast-shadow': shadowColor,
        bottom: `calc(${bottomOffset} + env(safe-area-inset-bottom, 0px))`,
      }}
    >
      {icon && (
        <span className="app-toast__icon" aria-hidden="true">{icon}</span>
      )}
      <span className="app-toast__text">{message}</span>
      {action && action}
    </div>
  );
};

export default AppToast;
