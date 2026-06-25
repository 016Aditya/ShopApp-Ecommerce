import "./skeletons.css";

/**
 * Skeleton for a single category card (the 5-card row on Home).
 */
const CategorySkeleton = ({ count = 5 }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="sk" style={{ height: 96, borderRadius: 8 }} />
    ))}
  </div>
);

export default CategorySkeleton;
