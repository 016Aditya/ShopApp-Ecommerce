/**
 * useQueryProfile.js — Phase 2C
 *
 * Raw TanStack Query hooks for User Profile.
 * Never imported directly by pages — consumed through
 * src/features/profile/hooks/useProfile.js.
 *
 * Cache strategy:
 *   staleTime : 5 minutes  — profile rarely changes mid-session
 *   gcTime    : 15 minutes — keep in memory for fast revisits to /profile
 *
 * Retry policy:
 *   Queries  : network failures + HTTP 5xx only
 *   Mutations: retry: 0 (user action — show error immediately)
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { getUserById, updateUserProfile } from "@/services/profileService";
import { isRetryable } from "@/lib/queryClient";

const PROFILE_STALE = 5 * 60 * 1000;   // 5 min
const PROFILE_GC    = 15 * 60 * 1000;  // 15 min

// ─────────────────────────────────────────────────────────────────────────────
// useProfileQuery
// GET /api/users/:userId
// ─────────────────────────────────────────────────────────────────────────────
export const useProfileQuery = (userId) =>
  useQuery({
    queryKey: queryKeys.profile.me(userId),
    queryFn:  () => getUserById(userId),
    enabled:  !!userId,
    staleTime: PROFILE_STALE,
    gcTime:    PROFILE_GC,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) =>
      isRetryable(error) && failureCount < 2,
  });

// ─────────────────────────────────────────────────────────────────────────────
// useUpdateProfileMutation
// PUT /api/users/:userId
//
// Optimistic update flow:
//   1. onMutate  — cancel in-flight queries, snapshot, patch cache immediately
//   2. onError   — roll back to snapshot
//   3. onSuccess — write server response into cache (no extra refetch needed)
//   4. onSettled — invalidate so background sync confirms server state
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

      // Patch cache immediately so the UI reflects the change at once
      qc.setQueryData(key, (old) =>
        old ? { ...old, ...profileData } : old
      );

      return { snapshot };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshot !== undefined) {
        qc.setQueryData(queryKeys.profile.me(userId), ctx.snapshot);
      }
    },

    onSuccess: (updated) => {
      // Write the server-confirmed object so we don't need a refetch
      qc.setQueryData(queryKeys.profile.me(userId), updated);
    },

    onSettled: () => {
      // Background sync — confirms server state without blocking the UI
      qc.invalidateQueries({ queryKey: queryKeys.profile.me(userId) });
    },
  });
};
