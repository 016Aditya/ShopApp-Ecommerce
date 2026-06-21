import "../styles/ReturnModal.css";

/**
 * ReturnModal
 *
 * Spec-exact copy:
 *   Title:   "Return this order?"
 *   Message: "Are you sure you want to return this product?
 *             Refund will be processed after successful pickup and verification."
 *   Buttons: "Cancel" | "Confirm Return"
 *
 * No reason textarea — spec does not require it.
 * The PATCH endpoint takes no body; reason is handled server-side if needed.
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
            disabled={isLoading}
            aria-label="Close dialog"
          >
            \u2715
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
            {isLoading ? "Processing\u2026" : "Confirm Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
