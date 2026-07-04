import { useState } from "react";
import "../styles/Reviews.css";
import { RATING_MIN, RATING_MAX } from "@/utils/constants";

const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-picker" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""} - ${LABELS[star]}`}
          className={`star-picker__star ${star <= (hovered || value) ? "star-picker__star--on" : ""}`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        >
          {"\u2605"}
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="star-picker__label">{LABELS[hovered || value]}</span>
      )}
    </div>
  );
};

const ReviewForm = ({
  productId,
  initialData = { rating: 0, comment: "" },
  reviewId,
  onSubmit,
  onCancel,
  submitting,
  actionError,
}) => {
  const isEdit = Boolean(reviewId);
  const [rating, setRating] = useState(initialData.rating ?? 0);
  const [comment, setComment] = useState(initialData.comment ?? "");
  const [localError, setLocalError] = useState(null);

  const handleRatingChange = (value) => {
    setRating(value);
    if (localError) {
      setLocalError(null);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    if (localError) {
      setLocalError(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError(null);

    if (rating < RATING_MIN || rating > RATING_MAX) {
      setLocalError("Please select a rating between 1 and 5.");
      return;
    }

    if (!comment.trim()) {
      setLocalError("Please write a comment.");
      return;
    }

    const payload = isEdit
      ? { rating, comment: comment.trim() }
      : { productId, rating, comment: comment.trim() };

    onSubmit(payload);
  };

  const shownError = localError || actionError;
  const charsLeft = 1000 - comment.length;

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <h3 className="review-form__title">
        {isEdit ? "Edit your review" : "Write a review"}
      </h3>

      <div className="review-form__group">
        <label className="review-form__label">Your Rating</label>
        <StarPicker value={rating} onChange={handleRatingChange} />
      </div>

      <div className="review-form__group">
        <label htmlFor="review-comment" className="review-form__label">
          Your Review
        </label>
        <textarea
          id="review-comment"
          className="review-form__textarea"
          rows={4}
          value={comment}
          onChange={handleCommentChange}
          placeholder="Share your experience with this product..."
          maxLength={1000}
          required
        />
        <small className={`review-form__char-count ${charsLeft < 50 ? "review-form__char-count--warn" : ""}`}>
          {charsLeft} characters remaining
        </small>
      </div>

      {shownError && <p className="review-form__error">{shownError}</p>}

      <div className="review-form__actions">
        <button type="submit" className="review-form__submit" disabled={submitting || rating === 0}>
          {submitting ? "Saving..." : isEdit ? "Update Review" : "Submit Review"}
        </button>
        {isEdit && onCancel && (
          <button
            type="button"
            className="review-form__cancel"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
