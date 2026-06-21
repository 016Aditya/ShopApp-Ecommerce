import "../styles/ReturnModal.css";

/**
 * ReturnModal
 *
 * Spec-exact confirmation modal:
 *   Title:   "Return this order?"
 *   Message: "Are you sure you want to return this product?"
 *            "Refund will be processed after successful pickup and verification."
 *   Buttons: "Cancel" | "Confirm Return"
 *
 * The reason textarea has been removed — the spec does not require it
 * in the confirmation modal. The backend endpoint (PATCH /api/orders/{id}/return)
 * takes no body.
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
        {/* Header */}
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

        {/* Body */}
        <div className="return-modal__body">
          <p className="return-modal__message">
            Are you sure you want to return this product?
          </p>
          <p className="return-modal__message return-modal__message--muted">
            Refund will be processed after successful pickup and verification.
          </p>
        </div>

        {/* Footer */}
        <div className="return-modal__footer">
          <button
            className="btn return-modal__btn return-modal__btn--cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn return-modal__btn return-modal__btn--confirm"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing…" : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
