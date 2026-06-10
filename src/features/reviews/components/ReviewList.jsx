import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import useReviews from "../hooks/useReviews";
import useReviewActions from "../hooks/useReviewActions";

/**
 * ReviewList — self-contained review section.
 * Drop it into any page that needs reviews.
 *
 * Props:
 *   productId    {string}
 *   currentUser  { id, ... } | null  — from AuthContext
 */
const ReviewList = ({ productId, currentUser }) => {
  const { reviews, loading, error, refetchReviews } = useReviews(productId);
  const { submitting, actionError, createReview, editReview, removeReview } =
    useReviewActions(refetchReviews);

  // Has the logged-in user already reviewed this product?
  const userReview = currentUser
    ? reviews.find((r) => r.userId === currentUser.id)
    : null;

  const handleCreate = (payload) => createReview(payload);
  const handleEdit   = (id, payload) => editReview(id, payload);
  const handleDelete = (id) => removeReview(id);

  // ── Average rating helper ─────────────────────────────────────────────────
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="review-section" aria-label="Customer reviews">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="review-section__header">
        <h2 className="review-section__title">Customer Reviews</h2>
        {avgRating && (
          <span className="review-section__avg">
            &#9733; {avgRating} &nbsp;
            <span className="review-section__count">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </span>
        )}
      </div>

      {/* ── Write / login prompt ──────────────────────────────────────────── */}
      {currentUser ? (
        !userReview && (
          <ReviewForm
            productId={productId}
            userId={currentUser.id}
            onSubmit={handleCreate}
            submitting={submitting}
            actionError={actionError}
          />
        )
      ) : (
        <p className="review-section__login-prompt">
          <a href="/login">Log in</a> to write a review.
        </p>
      )}

      {/* ── List ─────────────────────────────────────────────────────────── */}
      {loading && <p className="loading-text">Loading reviews…</p>}

      {!loading && error && (
        <p className="error-text">Could not load reviews: {error}</p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="review-section__empty">
          <p>No reviews yet. Be the first to share your thoughts!</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <ul className="review-list" role="list">
          {reviews.map((review) => (
            <li key={review.id} className="review-list__item">
              <ReviewCard
                review={review}
                currentUserId={currentUser?.id ?? null}
                onEdit={handleEdit}
                onDelete={handleDelete}
                submitting={submitting}
                actionError={actionError}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ReviewList;
