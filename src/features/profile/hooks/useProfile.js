/**
 * useProfile.js — Phase 2C
 *
 * Public-facing profile hook. All pages import from here.
 * Implementation is delegated entirely to TanStack Query hooks in
 * src/hooks/useQueryProfile.js — zero useState/useEffect for server state.
 *
 * Public API (unchanged from legacy):
 *   { profile, loading, error, success, updateProfile, fetchProfile }
 *
 * Changes from legacy:
 *   - profile    now comes from TQ cache (GET /api/users/:id), not useState
 *   - loading    maps to TQ isPending / isFetching
 *   - error      extracted from TQ error object
 *   - updateProfile triggers the TQ mutation; syncs AuthContext on success
 *   - fetchProfile is now a refetch() reference (no-op if called unnecessarily)
 *   - success    is derived from mutation state, cleared on next mutation
 */
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "@/hooks/useQueryProfile";

const useProfile = () => {
  const { user, updateUser } = useAuth();
  const userId = user?.id ?? user?._id;

  // ── Read ──────────────────────────────────────────────────────────────────
  const {
    data:    profileData,
    isLoading,
    isFetching,
    error:   queryError,
    refetch,
  } = useProfileQuery(userId);

  // ── Write ─────────────────────────────────────────────────────────────────
  const mutation = useUpdateProfileMutation(userId);

  // ── Derived state (mirrors legacy API) ───────────────────────────────────
  const [success, setSuccess] = useState(false);

  const loading = isLoading || isFetching || mutation.isPending;

  const error =
    mutation.error
      ? (mutation.error.response?.data?.error ??
         mutation.error.response?.data?.message ??
         mutation.error.message ??
         "Failed to update profile")
      : queryError
      ? (queryError.response?.data?.message ?? queryError.message ?? "Failed to load profile")
      : null;

  // ── updateProfile — public action ─────────────────────────────────────────
  const updateProfile = async (profileData) => {
    if (!userId) return;
    setSuccess(false);
    try {
      const updated = await mutation.mutateAsync(profileData);
      // Sync editable fields back into AuthContext + localStorage
      updateUser({
        firstName:   updated?.firstName   ?? profileData.firstName,
        lastName:    updated?.lastName    ?? profileData.lastName,
        phoneNumber: updated?.phoneNumber ?? profileData.phoneNumber,
      });
      setSuccess(true);
    } catch {
      // error is surfaced through the `error` field above
    }
  };

  // fetchProfile kept as a stable refetch reference for components that call
  // it explicitly (backwards-compatible no-op pattern from Phase 2A/2B).
  const fetchProfile = refetch;

  return {
    profile:       profileData ?? null,
    loading,
    error,
    success,
    updateProfile,
    fetchProfile,
  };
};

export default useProfile;
