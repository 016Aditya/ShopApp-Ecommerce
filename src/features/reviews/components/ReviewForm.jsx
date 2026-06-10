import { useState } from "react";
import RatingStars from "./RatingStars";
import { RATING_MIN, RATING_MAX } from "@/utils/constants";

/**
 * ReviewForm — shared for both Create and Edit.
 *
 * Props:
 *   productId   {string}
 *   userId      {string}
 *   initialData { rating, comment } — for edit mode
 *   reviewId    {string}            — if set, form is in edit mode
 *   onSubmit    {function(payload)} — called with { productId, userId, rating, comment } or { rating, comment }
 *   onCancel    {function}          — shown in edit mode only
 *   submitting  {boolean}
 *   actionError {string|null}
 */
const ReviewForm = ({
  productId,
  userId,
  initialData = { rating: 0, comment: "" },
  reviewId,
  onSubmit,
  onCancel,
  submitting,
  actionError,
}) => {
  const isEdit = Boolean(reviewId);

  const [rating, setRating]   = useState(initialData.rating ?? 0);
  const [comment, setComment] = useState(initialData.comment ?? "");
  const [localError, setLocalError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
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
      : { productId, userId, rating, comment: comment.trim() };

    onSubmit(payload);
  };

  const shownError = localError || actionError;

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <h3 className="review-form__title">
        {isEdit ? "Edit your review" : "Write a review"}
      </h3>

      <div className="form-group">
        <label className="form-label">Your rating</label>
        <RatingStars value={rating} onChange={setRating} />
      </div>

      <div className="form-group">
        <label htmlFor="review-comment" className="form-label">
          Comment
        </label>
        <textarea
          id="review-comment"
          className="input review-form__textarea"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product…"
          maxLength={1000}
          required
        />
        <small className="input-hint">{comment.length}/1000</small>
      </div>

      {shownError && <p className="error-text">{shownError}</p>}

      <div className="review-form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting}
        >
          {submitting ? "Saving…" : isEdit ? "Update Review" : "Submit Review"}
        </button>

        {isEdit && onCancel && (
          <button
            type="button"
            className="btn btn--ghost"
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
