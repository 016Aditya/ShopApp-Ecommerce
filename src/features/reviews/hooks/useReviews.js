/**
 * useReviews.js — Phase 2B
 *
 * Public-facing hook for reading the review list for a product.
 * Data fetching is delegated to useReviewsByProductQuery.
 *
 * Public API preserved exactly:
 *   useReviews(productId) → { reviews, loading, error, refetchReviews }
 *
 * ReviewList.jsx is unchanged — it continues to destructure the same fields
 * and passes refetchReviews to useReviewActions as the onSuccess callback.
 * TanStack Query's refetch function is a stable reference, so it behaves
 * identically to the previous manual fetchReviews callback.
 */
import { useReviewsByProductQuery } from '@/hooks/useQueryReviews';

function useReviews(productId) {
  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useReviewsByProductQuery(productId);

  return {
    reviews,
    loading:        isLoading,
    error:          isError
      ? (error?.response?.data?.message ?? error?.message ?? 'Failed to fetch reviews')
      : null,
    refetchReviews: refetch,
  };
}

export default useReviews;
