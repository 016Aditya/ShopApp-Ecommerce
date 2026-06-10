import { useCallback, useEffect, useState } from "react";
import { getReviewsByProduct } from "@/services/reviewService";

function useReviews(productId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setReviews([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getReviewsByProduct(productId);
      setReviews(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refetchReviews: fetchReviews };
}

export default useReviews;
