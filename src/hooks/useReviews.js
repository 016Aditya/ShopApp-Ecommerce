import { useState, useEffect, useCallback } from 'react';
import api from '../services/apiClient'; // Or wherever your configured axios instance is
import { API_ENDPOINTS } from '../utils/constants'; // Adjust path to your constants

const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We wrap the fetch logic in useCallback so it's stable and won't cause infinite loops
  // when we pass it down to other components (like your refetch function).
  const fetchReviews = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);
    
    try {
      // Hits your GET /api/reviews/product/{productId} endpoint
      const { data } = await api.get(`${API_ENDPOINTS.REVIEWS}/product/${productId}`);
      
      // Sort reviews so the newest ones show up at the top
      const sortedReviews = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setReviews(sortedReviews);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.response?.data?.message || "Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Automatically fetch reviews when the hook first runs, 
  // or whenever the productId changes.
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    refetchReviews: fetchReviews, // Exported so useReviewActions can trigger a reload
  };
};

export default useReviews;