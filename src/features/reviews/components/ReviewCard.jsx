import { useState } from "react";
import ReviewForm from "./ReviewForm";

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

/**
 * StarDisplay — solid integer stars for individual reviews.
 * size="sm"  → 18px  (used in review cards)
 * size="md"  → 22px  (default)
 */
const StarDisplay = ({ value, size = "md" }) => {
  const sz = size === "sm" ? "1.125rem" : "1.375rem"; // 18px / 22px
  return (
    <span className="review-stars-display" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            fontSize: sz,
            color: s <= value ? "#e77600" : "#d5d5d5",
            marginRight: "1px",
            lineHeight: 1,
            display: "inline-block",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
};

const ReviewCard = ({ review, currentUserId, onEdit, onDelete, submitting, actionError }) => {
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const isOwner = currentUserId && currentUserId === review.userId;

  // Pass productId through so useReviewActions can target the correct cache key
  const handleEditSubmit = (payload) => {
    onEdit(review.id, { ...payload, productId: review.productId });
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(review.id, review.productId);
  };

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "";

  const initials = review.userName
    ? review.userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

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
      <div className="review-card__top">
        <div className="review-card__avatar">{initials}</div>
        <div className="review-card__meta">
          <span className="review-card__username">{review.userName || "Anonymous"}</span>
          <div className="review-card__rating-row">
            <StarDisplay value={review.rating} size="sm" />
            <span className="review-card__rating-label">{STAR_LABELS[review.rating]}</span>
          </div>
        </div>
        {formattedDate && <span className="review-card__date">{formattedDate}</span>}
      </div>

      <p className="review-card__comment">{review.comment}</p>

      {isOwner && !showDelete && (
        <div className="review-card__actions">
          <button type="button" className="review-action-btn review-action-btn--edit" onClick={() => setEditing(true)} disabled={submitting}>
            ✎ Edit
          </button>
          <button type="button" className="review-action-btn review-action-btn--delete" onClick={() => setShowDelete(true)} disabled={submitting}>
            🗑 Delete
          </button>
        </div>
      )}

      {showDelete && (
        <div className="review-card__confirm-delete">
          <p>Are you sure you want to delete this review?</p>
          <div className="review-card__actions">
            <button type="button" className="review-action-btn review-action-btn--delete" onClick={handleDelete} disabled={submitting}>
              Yes, Delete
            </button>
            <button type="button" className="review-action-btn review-action-btn--cancel" onClick={() => setShowDelete(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
