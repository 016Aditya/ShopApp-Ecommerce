// src/features/orders/components/ReturnModal.jsx
import "../styles/ReturnModal.css";

/**
 * ReturnModal
 *
 * FIX: OrderDetailPage was passing `open={...}` but this component was
 * reading `isOpen`. Because `isOpen` was always `undefined` (falsy),
 * the modal returned null every single time and never rendered.
 *
 * Both prop names are now accepted for backwards compatibility:
 *   open     — used by OrderDetailPage (existing call sites)
 *   isOpen   — alias (same behaviour)
 *
 * Props:
 *   open / isOpen  {boolean}  — whether the modal is visible
 *   onClose        {function} — called on Cancel or overlay click
 *   onConfirm      {function} — called on "Confirm Return" click
 *   loading        {boolean}  — disables buttons and shows loading text
 *                               (OrderDetailPage passes `loading`, not `isLoading`)
 */
const ReturnModal = ({ open, isOpen, onClose, onConfirm, loading = false, isLoading = false }) => {
  // Accept either prop name so both call-site conventions work
  const visible  = open ?? isOpen ?? false;
  const spinning = loading || isLoading;

  if (!visible) return null;

  return (
    <div
      className="return-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="return-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="return-modal-title"
      >
        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="return-modal__header">
          <h2 className="return-modal__title" id="return-modal-title">
            Return this order?
          </h2>
          <button
            className="return-modal__close"
            onClick={onClose}
            aria-label="Close return modal"
            disabled={spinning}
          >
            ✕
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className="return-modal__body">
          <p className="return-modal__message">
            Are you sure you want to return this product?
          </p>
          <p className="return-modal__message return-modal__message--muted">
            Refund will be processed after successful pickup and verification.
          </p>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="return-modal__footer">
          <button
            className="return-modal__btn return-modal__btn--cancel"
            onClick={onClose}
            disabled={spinning}
            type="button"
          >
            Cancel
          </button>
          <button
            className="return-modal__btn return-modal__btn--confirm"
            onClick={onConfirm}
            disabled={spinning}
            type="button"
          >
            {spinning ? "Processing…" : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
