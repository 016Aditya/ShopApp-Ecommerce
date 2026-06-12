import "@/styles/Reviews.css";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import useReviews from "../hooks/useReviews";
import useReviewActions from "../hooks/useReviewActions";

const StarBar = ({ label, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="star-bar">
      <span className="star-bar__label">{label} ★</span>
      <div className="star-bar__track">
        <div className="star-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="star-bar__count">{count}</span>
    </div>
  );
};

const ReviewList = ({ productId, currentUser }) => {
  const { reviews, loading, error, refetchReviews } = useReviews(productId);
  const { submitting, actionError, createReview, editReview, removeReview } =
    useReviewActions(refetchReviews);

  const userReview = currentUser
    ? reviews.find((r) => r.userId === currentUser.id)
    : null;

  const handleCreate = (payload) => createReview(payload);
  const handleEdit   = (id, payload) => editReview(id, payload);
  const handleDelete = (id) => removeReview(id);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="review-section" aria-label="Customer reviews">
      <h2 className="review-section__title">Customer Reviews</h2>

      {reviews.length > 0 && (
        <div className="review-summary">
          <div className="review-summary__score">
            <span className="review-summary__avg">{avgRating.toFixed(1)}</span>
            <div className="review-summary__stars">
              {[1,2,3,4,5].map((s) => (
                <span key={s} style={{ color: s <= Math.round(avgRating) ? "#e77600" : "#ddd", fontSize: "1.4rem" }}>★</span>
              ))}
            </div>
            <span className="review-summary__total">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
          <div className="review-summary__bars">
            {distribution.map(({ star, count }) => (
              <StarBar key={star} label={star} count={count} total={reviews.length} />
            ))}
          </div>
        </div>
      )}

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
        <div className="review-login-prompt">
          <span>📝</span>
          <p>Have this product? <a href="/login">Log in</a> to share your review.</p>
        </div>
      )}

      {loading && (
        <div className="review-loading">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="review-card review-card--skeleton">
              <div className="skeleton" style={{ height: 16, width: "30%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 14, width: "80%" }} />
            </div>
          ))}
        </div>
      )}

      {!loading && error && <p className="review-error">Could not load reviews: {error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <div className="review-empty">
          <span className="review-empty__icon">💬</span>
          <p className="review-empty__title">No reviews yet</p>
          <p className="review-empty__sub">Be the first to share your thoughts!</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <ul className="review-list" role="list">
          {reviews.map((review) => (
            <li key={review.id}>
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
