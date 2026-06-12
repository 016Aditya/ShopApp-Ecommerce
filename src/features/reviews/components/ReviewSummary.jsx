/**
 * ReviewSummary  —  shows avg rating + star breakdown bar chart.
 * Props: reviews  {Array<{rating: number}>}
 */
const ReviewSummary = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const total  = reviews.length;
  const avg    = (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="review-summary">
      {/* Big avg */}
      <div className="review-summary__avg">
        <span className="review-summary__big">{avg}</span>
        <span className="review-summary__stars">{'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}</span>
        <span className="review-summary__total">{total} {total === 1 ? 'rating' : 'ratings'}</span>
      </div>

      {/* Bar breakdown */}
      <div className="review-summary__bars">
        {counts.map(({ star, count }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={star} className="review-summary__bar-row">
              <span className="review-summary__bar-label">{star} ★</span>
              <div className="review-summary__bar-track">
                <div
                  className="review-summary__bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="review-summary__bar-pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewSummary;
