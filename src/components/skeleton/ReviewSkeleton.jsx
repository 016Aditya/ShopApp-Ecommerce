import "./skeletons.css";

/**
 * One review card skeleton: avatar + username + stars + comment lines.
 */
const ReviewCardSkeleton = () => (
  <div
    className="review-card"
    style={{ padding: "16px 0", borderBottom: "1px solid var(--border-color)" }}
    aria-hidden="true"
  >
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <div className="sk flex-shrink-0" style={{ width: 40, height: 40, borderRadius: "50%" }} />
      <div className="flex-1">
        {/* Username + date row */}
        <div className="flex items-center gap-3 mb-2">
          <div className="sk" style={{ height: 14, width: 100 }} />
          <div className="sk" style={{ height: 12, width: 70 }} />
        </div>
        {/* Stars */}
        <div className="sk mb-2" style={{ height: 16, width: 90, borderRadius: 999 }} />
        {/* Comment lines */}
        <div className="sk mb-1" style={{ height: 13 }} />
        <div className="sk mb-1" style={{ height: 13, width: "90%" }} />
        <div className="sk" style={{ height: 13, width: "65%" }} />
      </div>
    </div>
  </div>
);

/**
 * Review summary skeleton (average score + distribution bars).
 */
const ReviewSummarySkeleton = () => (
  <div className="review-summary" aria-hidden="true">
    <div className="review-summary__score" style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <div className="sk" style={{ height: 48, width: 64 }} />
      <div className="sk" style={{ height: 20, width: 110, borderRadius: 999 }} />
      <div className="sk" style={{ height: 14, width: 80 }} />
    </div>
    <div className="review-summary__bars" style={{ flex: 1 }}>
      {[5, 4, 3, 2, 1].map((s) => (
        <div key={s} className="flex items-center gap-2 mb-1">
          <div className="sk" style={{ height: 12, width: 24 }} />
          <div className="sk flex-1" style={{ height: 10, borderRadius: 999 }} />
          <div className="sk" style={{ height: 12, width: 20 }} />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Full reviews section skeleton (summary + N cards).
 */
const ReviewSkeleton = ({ count = 4 }) => (
  <section className="review-section" aria-hidden="true">
    <div className="sk mb-4" style={{ height: 22, width: 160 }} />
    <ReviewSummarySkeleton />
    <div style={{ marginTop: 24 }}>
      {Array.from({ length: count }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  </section>
);

export { ReviewCardSkeleton, ReviewSummarySkeleton };
export default ReviewSkeleton;
