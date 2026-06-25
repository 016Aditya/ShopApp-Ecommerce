/**
 * useQueryProfile.js — Phase 2C
 *
 * Raw TanStack Query hooks for User Profile.
 * Consumed through src/features/profile/hooks/useProfile.js.
 *
 * Cache strategy:
 *   staleTime : 5 minutes
 *   gcTime    : 15 minutes
 *
 * Retry policy:
 *   Queries  : network failures + HTTP 5xx only (401/403/404 never retried)
 *   Mutations: retry: 0
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getUserById, updateUserProfile } from "@/services/profileService";

const PROFILE_STALE = 5 * 60 * 1000;   // 5 min
const PROFILE_GC    = 15 * 60 * 1000;  // 15 min

/** Returns true when the query should be retried for this error. */
const shouldRetry = (failureCount, error) => {
  if (failureCount >= 2) return false;
  const status = error?.response?.status;
  if (!status) return true;                               // network failure
  if (status === 401 || status === 403 || status === 404) return false;
  if (status >= 400 && status < 500) return false;        // other 4xx
  return true;                                            // 5xx
};

// ─────────────────────────────────────────────────────────────────────────────
// useProfileQuery — GET /api/users/:userId
// ─────────────────────────────────────────────────────────────────────────────
export const useProfileQuery = (userId) =>
  useQuery({
    queryKey: queryKeys.profile.me(userId),
    queryFn:  () => getUserById(userId),
    enabled:  !!userId,
    staleTime: PROFILE_STALE,
    gcTime:    PROFILE_GC,
    refetchOnWindowFocus: false,
    retry: shouldRetry,
  });

// ─────────────────────────────────────────────────────────────────────────────
// useUpdateProfileMutation — PUT /api/users/:userId
//
// Optimistic update flow:
//   onMutate  → cancel in-flight, snapshot, patch cache immediately
//   onError   → roll back to snapshot
//   onSuccess → write server-confirmed object (no extra refetch)
//   onSettled → background invalidation to confirm server state
// ─────────────────────────────────────────────────────────────────────────────
export const useUpdateProfileMutation = (userId) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (profileData) => updateUserProfile(userId, profileData),
    retry: 0,

    onMutate: async (profileData) => {
      const key = queryKeys.profile.me(userId);
      await qc.cancelQueries({ queryKey: key });
      const snapshot = qc.getQueryData(key);
      qc.setQueryData(key, (old) => old ? { ...old, ...profileData } : old);
      return { snapshot };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot !== undefined) {
        qc.setQueryData(queryKeys.profile.me(userId), ctx.snapshot);
      }
    },

    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.profile.me(userId), updated);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile.me(userId) });
    },
  });
};
