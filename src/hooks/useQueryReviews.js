/**
 * useQueryReviews.js — Phase 2B
 *
 * Low-level TanStack Query hooks for the Reviews domain.
 * These are NOT consumed by pages directly — they are consumed by
 * useReviews.js and useReviewActions.js.
 *
 * Cache strategy:
 *   staleTime :  2 min — reviews are moderately stable; avoids thrashing
 *                        on quick product-page visits
 *   gcTime    : 10 min — survives ProductDetail → back → same ProductDetail
 *                        navigation without a network round-trip
 *
 * Optimistic updates:
 *   editReview   — snapshot → patch cache → request → rollback on error → settle
 *   deleteReview — snapshot → remove from cache → request → rollback on error → settle
 *
 * addReview uses a normal mutation + invalidation because the user just
 * submitted content and a brief refetch confirming server state is acceptable.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addReview,
  deleteReview,
  getReviewsByProduct,
  updateReview,
} from '@/services/reviewService';
import { queryKeys } from '@/lib/queryKeys';

const STALE_REVIEWS = 2 * 60_000;  // 2 minutes
const GC_REVIEWS    = 10 * 60_000; // 10 minutes

// ── Reviews by product ───────────────────────────────────────────────────────
export function useReviewsByProductQuery(productId) {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn:  () => getReviewsByProduct(productId),
    enabled:   Boolean(productId),
    staleTime: STALE_REVIEWS,
    gcTime:    GC_REVIEWS,
  });
}

// ── Add review mutation ──────────────────────────────────────────────────────
/**
 * Variables shape: { productId, rating, comment }
 *
 * On success:
 *   Invalidate reviews.byProduct  — review list refreshes with the new review.
 *   Invalidate products.detail    — average rating badge on the product page updates.
 */
export function useAddReviewMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) => addReview(payload),
    retry: 0,
    onSuccess: (_data, { productId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(productId) });
      qc.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
    },
  });
}

// ── Edit review mutation (optimistic) ───────────────────────────────────────
/**
 * Variables shape: { reviewId, productId, rating, comment }
 *
 * Flow:
 *   onMutate  → cancel in-flight queries → snapshot current list →
 *               apply change immediately to cache
 *   onError   → restore snapshot (rollback)
 *   onSettled → invalidate to sync with server regardless of outcome
 *
 * If the backend returns the updated review object, setQueryData could replace
 * the invalidation in onSettled — but invalidation is safer and handles cases
 * where the server applies additional transformations (e.g. updatedAt timestamp).
 */
export function useEditReviewMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, rating, comment }) =>
      updateReview(reviewId, { rating, comment }),
    retry: 0,

    onMutate: async ({ reviewId, productId, rating, comment }) => {
      const key = queryKeys.reviews.byProduct(productId);

      // Cancel any in-flight refetch so it does not overwrite the optimistic update
      await qc.cancelQueries({ queryKey: key });

      // Save snapshot for rollback
      const snapshot = qc.getQueryData(key);

      // Apply optimistic change immediately
      qc.setQueryData(key, (prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((r) =>
          r.id === reviewId ? { ...r, rating, comment } : r,
        );
      });

      return { snapshot, key };
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot !== undefined) {
        qc.setQueryData(context.key, context.snapshot);
      }
    },

    onSettled: (_data, _err, { productId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(productId) });
    },
  });
}

// ── Delete review mutation (optimistic) ─────────────────────────────────────
/**
 * Variables shape: { reviewId, productId }
 *
 * Flow:
 *   onMutate  → cancel in-flight queries → snapshot → remove review from cache
 *   onError   → restore snapshot (rollback)
 *   onSettled → invalidate review list + product detail
 *               (product detail update is required so average rating refreshes)
 */
export function useDeleteReviewMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId }) => deleteReview(reviewId),
    retry: 0,

    onMutate: async ({ reviewId, productId }) => {
      const key = queryKeys.reviews.byProduct(productId);

      await qc.cancelQueries({ queryKey: key });

      const snapshot = qc.getQueryData(key);

      qc.setQueryData(key, (prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.filter((r) => r.id !== reviewId);
      });

      return { snapshot, key };
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot !== undefined) {
        qc.setQueryData(context.key, context.snapshot);
      }
    },

    onSettled: (_data, _err, { productId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(productId) });
      qc.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
    },
  });
}
