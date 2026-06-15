const RatingBadge = ({ rating = 0, count = 0, showCount = true }) => {
  const roundedRating = Math.round(rating * 10) / 10;
  const displayRating = rating ? roundedRating : 0;

  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-xs font-bold text-white">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {displayRating}
      </span>
      {showCount && count > 0 && (
        <span className="text-xs text-gray-600 font-medium">
          {count} {count === 1 ? "review" : "reviews"}
        </span>
      )}
    </div>
  );
};

export default RatingBadge;
