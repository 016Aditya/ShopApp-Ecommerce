import { useState } from "react";
import ReviewForm from "./ReviewForm";

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

// Helper component for static display
const StarDisplay = ({ value, size = "md" }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const sz = size === "sm" ? "1rem" : "1.2rem";
  return (
    <span className="review-stars-display" aria-label={`${value} out of 5 stars`}>
      {stars.map((s) => (
        <span
          key={s}
          style={{
            fontSize: sz,
            color: s <= value ? "#e77600" : "#ddd",
            marginRight: "1px",
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

  const handleEditSubmit = (payload) => {
    onEdit(review.id, payload);
    setEditing(false);
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
            <button type="button" className="review-action-btn review-action-btn--delete" onClick={() => onDelete(review.id)} disabled={submitting}>
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