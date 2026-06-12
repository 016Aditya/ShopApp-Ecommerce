/**
 * ReviewItem  —  single review card.
 * Props: review { id, userId, userName, rating, comment, createdAt }
 *        currentUserId, onEdit, onDelete, submitting
 */
const ReviewItem = ({ review, currentUserId, onEdit, onDelete, submitting }) => {
  const isOwner = currentUserId && currentUserId === review.userId;
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "";

  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

  return (
    <div className="review-item">
      <div className="review-item__header">
        <span className="review-item__stars" style={{ color: "#e77600" }}>{stars}</span>
        <span className="review-item__user">{review.userName ?? "Anonymous"}</span>
        {date && <span className="review-item__date">{date}</span>}
      </div>
      <p className="review-item__comment">{review.comment}</p>
      {isOwner && (
        <div className="review-item__actions">
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => onEdit(review.id, { rating: review.rating, comment: review.comment })}
            disabled={submitting}
          >
            Edit
          </button>
          <button
            className="btn btn--ghost btn--sm review-item__delete"
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

export default ReviewItem;
