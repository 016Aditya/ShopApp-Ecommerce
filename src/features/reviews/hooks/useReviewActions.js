/**
 * useReviewActions.js — Phase 2B
 *
 * Public-facing hook for review mutations (create, edit, delete).
 * Mutation logic is delegated to TanStack Query hooks in useQueryReviews.js.
 *
 * Public API preserved exactly:
 *   useReviewActions(onSuccess) →
 *     { submitting, actionError, resetError, createReview, editReview, removeReview }
 *
 * ReviewList.jsx is unchanged — it continues to pass refetchReviews as onSuccess
 * and destructures the same fields.
 *
 * Optimistic updates:
 *   editReview   — cache is patched immediately; rolled back on failure
 *   deleteReview — review is removed from cache immediately; rolled back on failure
 *   createReview — normal mutation followed by targeted invalidation
 *
 * IMPORTANT: editReview and removeReview now require productId so the mutation
 * hooks can target the correct cache entry. ReviewCard.jsx has been updated to
 * pass productId through its onEdit and onDelete callbacks.
 */
import { useState } from 'react';
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useEditReviewMutation,
} from '@/hooks/useQueryReviews';

function useReviewActions(onSuccess) {
  const [actionError, setActionError] = useState(null);

  const addMutation    = useAddReviewMutation();
  const editMutation   = useEditReviewMutation();
  const deleteMutation = useDeleteReviewMutation();

  const submitting =
    addMutation.isPending ||
    editMutation.isPending ||
    deleteMutation.isPending;

  const resetError = () => setActionError(null);

  // ── Create ────────────────────────────────────────────────────────────────
  // payload: { productId, rating, comment }
  const createReview = async (payload) => {
    setActionError(null);
    try {
      await addMutation.mutateAsync(payload);
      onSuccess?.();
    } catch (err) {
      setActionError(
        err?.response?.data?.message ?? err?.message ?? 'Failed to submit review',
      );
    }
  };

  // ── Edit ──────────────────────────────────────────────────────────────────
  // Signature: editReview(reviewId, { rating, comment, productId })
  // ReviewCard calls onEdit(review.id, { rating, comment, productId: review.productId })
  const editReview = async (reviewId, { rating, comment, productId }) => {
    setActionError(null);
    try {
      await editMutation.mutateAsync({ reviewId, productId, rating, comment });
      onSuccess?.();
    } catch (err) {
      setActionError(
        err?.response?.data?.message ?? err?.message ?? 'Failed to update review',
      );
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  // Signature: removeReview(reviewId, productId)
  // ReviewCard calls onDelete(review.id, review.productId)
  const removeReview = async (reviewId, productId) => {
    setActionError(null);
    try {
      await deleteMutation.mutateAsync({ reviewId, productId });
      onSuccess?.();
    } catch (err) {
      setActionError(
        err?.response?.data?.message ?? err?.message ?? 'Failed to delete review',
      );
    }
  };

  return {
    submitting,
    actionError,
    resetError,
    createReview,
    editReview,
    removeReview,
  };
}

export default useReviewActions;
