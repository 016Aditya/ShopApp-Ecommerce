import { useState } from "react";
import "../styles/ReturnModal.css";

const ReturnModal = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError("Please provide a reason for the return.");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters long.");
      return;
    }

    try {
      setError(null);
      await onConfirm(reason.trim());
    } catch (err) {
      setError(err.message || "Failed to process return request");
    }
  };

  const handleClose = () => {
    setReason("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="return-modal-overlay" onClick={handleClose}>
      <div className="return-modal" onClick={(e) => e.stopPropagation()}>
        <div className="return-modal__header">
          <h2 className="return-modal__title">Request Return</h2>
          <button
            className="return-modal__close"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="return-modal__form">
          <div className="return-modal__body">
            <p className="return-modal__description">
              Please tell us why you want to return this order. We'll use this information to improve our service.
            </p>

            <div className="return-modal__field">
              <label htmlFor="return-reason" className="return-modal__label">
                Reason for Return <span className="return-modal__required">*</span>
              </label>
              <textarea
                id="return-reason"
                className="return-modal__textarea"
                placeholder="Example: Product doesn't match the description, arrived damaged, changed mind, etc."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError(null); // Clear error on input change
                }}
                disabled={isLoading}
                minLength={10}
                maxLength={500}
                rows={4}
              />
              <p className="return-modal__char-count">
                {reason.length}/500 characters
              </p>
            </div>

            {error && (
              <div className="return-modal__error">
                <span className="return-modal__error-icon">⚠️</span>
                <span className="return-modal__error-text">{error}</span>
              </div>
            )}

            <div className="return-modal__info">
              <p className="return-modal__info-title">What happens next:</p>
              <ul className="return-modal__info-list">
                <li>We'll schedule a pickup for your package</li>
                <li>Once picked up, we'll inspect the items</li>
                <li>Your refund will be processed within 7-10 business days</li>
              </ul>
            </div>
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
              type="submit"
              className="btn return-modal__btn return-modal__btn--submit"
              disabled={isLoading || !reason.trim()}
            >
              {isLoading ? "Processing..." : "Confirm Return"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnModal;
