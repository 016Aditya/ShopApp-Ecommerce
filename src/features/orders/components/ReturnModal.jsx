import { useState } from "react";
import "../styles/ReturnModal.css";

/**
 * ReturnModal
 *
 * FIX: Updated to match spec exactly:
 *   Title:   "Return this order?"
 *   Message: "Are you sure you want to return this product?
 *             Refund will be processed after successful pickup and verification."
 *   Buttons: "Cancel"  |  "Confirm Return"
 *
 * The reason textarea is removed — the spec does not require it in the
 * confirmation modal. The backend endpoint only requires hitting
 * PATCH /api/orders/{id}/return; reason is optional and can be added
 * later as a separate step if needed.
 */

const ReturnModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    try {
      setError(null);
      await onConfirm();
    } catch (err) {
      setError(err.message || "Failed to process return request.");
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="return-modal-overlay" onClick={handleClose}>
      <div className="return-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="return-modal-title">
        <div className="return-modal__header">
          <h2 className="return-modal__title" id="return-modal-title">Return this order?</h2>
          <button
            className="return-modal__close"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="return-modal__body">
          <p className="return-modal__description">
            Are you sure you want to return this product?
          </p>
          <p className="return-modal__description return-modal__description--secondary">
            Refund will be processed after successful pickup and verification.
          </p>

          {error && (
            <div className="return-modal__error">
              <span className="return-modal__error-icon">⚠️</span>
              <span className="return-modal__error-text">{error}</span>
            </div>
          )}
        </div>

        <div className="return-modal__footer">
          <button
            type="button"
            className="btn return-modal__btn return-modal__btn--cancel"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn return-modal__btn return-modal__btn--submit"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
