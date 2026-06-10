import { useState } from "react";
import RatingStars from "./RatingStars";
import ReviewForm from "./ReviewForm";

/**
 * ReviewCard — renders a single review.
 * If the logged-in userId matches the review's userId, shows Edit / Delete.
 *
 * Props:
 *   review      { id, userId, rating, comment, createdAt }
 *   currentUserId {string|null}
 *   onEdit      {function(id, { rating, comment })}
 *   onDelete    {function(id)}
 *   submitting  {boolean}
 *   actionError {string|null}
 */
const ReviewCard = ({
  review,
  currentUserId,
  onEdit,
  onDelete,
  submitting,
  actionError,
}) => {
  const [editing, setEditing] = useState(false);
  const isOwner = currentUserId && currentUserId === review.userId;

  const handleEditSubmit = (payload) => {
    onEdit(review.id, payload);
    setEditing(false);
  };

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  if (editing) {
    return (
      <div className="review-card review-card--editing">
        <ReviewForm
          reviewId={review.id}
          initialData={{ rating: review.rating, comment: review.comment }}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditing(false)}
          submitting={submitting}
          actionError={actionError}
        />
      </div>
    );
  }

  return (
    <div className="review-card">
      <div className="review-card__header">
        <RatingStars value={review.rating} size="sm" />
        {formattedDate && (
          <span className="review-card__date">{formattedDate}</span>
        )}
      </div>

      <p className="review-card__comment">{review.comment}</p>

      {isOwner && (
        <div className="review-card__actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setEditing(true)}
            disabled={submitting}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn--danger btn--sm"
            onClick={() => onDelete(review.id)}
            disabled={submitting}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
