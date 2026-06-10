/**
 * RatingStars — pure display OR interactive star picker.
 *
 * Props:
 *   value    {number}   1-5 current value
 *   onChange {function} if provided, renders interactive stars
 *   size     {string}   "sm" | "md" (default "md")
 */
const RatingStars = ({ value = 0, onChange, size = "md" }) => {
  const interactive = typeof onChange === "function";

  return (
    <div
      className={`rating-stars rating-stars--${size}${interactive ? " rating-stars--interactive" : ""}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Rating: ${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`rating-stars__star${
            star <= value ? " rating-stars__star--filled" : ""
          }`}
          onClick={interactive ? () => onChange(star) : undefined}
          disabled={!interactive}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          aria-pressed={interactive ? star === value : undefined}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
