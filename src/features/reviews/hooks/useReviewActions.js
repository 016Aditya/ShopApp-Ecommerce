import { useState } from "react";
import {
  addReview,
  updateReview,
  deleteReview,
} from "@/services/reviewService";

/**
 * Handles create / update / delete mutations for reviews.
 * Pass `onSuccess` callback (usually `refetchReviews`) to refresh the list
 * after every mutation.
 */
function useReviewActions(onSuccess) {
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const resetError = () => setActionError(null);

  const createReview = async (payload) => {
    setSubmitting(true);
    setActionError(null);
    try {
      await addReview(payload);
      onSuccess && onSuccess();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const editReview = async (id, payload) => {
    setSubmitting(true);
    setActionError(null);
    try {
      await updateReview(id, payload);
      onSuccess && onSuccess();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to update review");
    } finally {
      setSubmitting(false);
    }
  };

  const removeReview = async (id) => {
    setSubmitting(true);
    setActionError(null);
    try {
      await deleteReview(id);
      onSuccess && onSuccess();
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to delete review");
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, actionError, resetError, createReview, editReview, removeReview };
}

export default useReviewActions;
