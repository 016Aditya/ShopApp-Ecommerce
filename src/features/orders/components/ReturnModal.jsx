// src/features/orders/components/ReturnModal.jsx
import "../styles/ReturnModal.css";

/**
 * ReturnModal
 *
 * Fixes applied:
 *   1. Title now exactly matches spec: "Return this order?"
 *   2. Message now exactly matches spec (two lines per spec).
 *   3. Removed the "reason" textarea — spec does not include it.
 *   4. Added CSS import (ReturnModal.css was missing entirely).
 *   5. Buttons: "Cancel" | "Confirm Return" (spec exact).
 *   6. Overlay click closes the modal (UX standard).
 *
 * Props:
 *   isOpen    {boolean}  — whether the modal is visible
 *   onClose   {function} — called on Cancel or overlay click
 *   onConfirm {function} — called on "Confirm Return" click
 *   isLoading {boolean}  — disables buttons and shows loading text
 */
const ReturnModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  if (!isOpen) return null;

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
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="return-modal__body">
          <p className="return-modal__message">
            Are you sure you want to return this product?
          </p>
          <p className="return-modal__message return-modal__message--muted">
            Refund will be processed after successful pickup and verification.
          </p>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <div className="return-modal__footer">
          <button
            className="return-modal__btn return-modal__btn--cancel"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            Cancel
          </button>
          <button
            className="return-modal__btn return-modal__btn--confirm"
            onClick={onConfirm}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? "Processing…" : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
