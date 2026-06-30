import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService }  from '@/services/userService';
import { QUERY_KEYS }   from '@/lib/queryKeys';
import { useAuth }      from '@/features/auth/hooks/useAuth';

/**
 * useProfileQuery
 * Fetches the current user's profile from GET /api/users/:id.
 * Returns a TanStack Query result — { data, isLoading, isError, refetch }.
 */
export const useProfileQuery = (userId) =>
  useQuery({
    queryKey: QUERY_KEYS.profile(userId),
    queryFn:  () => userService.getUserProfile(userId),
    enabled:  !!userId,
    staleTime: 1000 * 60 * 5, // 5 min — profile doesn't change often
  });

/**
 * useUpdateProfile
 * Wraps PUT /api/users/:id.
 * On success:
 *   1. Updates the Zustand auth store so the Navbar reflects new name instantly.
 *   2. Invalidates the profile TanStack cache so ProfilePage re-fetches.
 *
 * Usage:
 *   const { mutate, isLoading } = useUpdateProfile();
 *   mutate({ userId: user.id, payload: { firstName, lastName, address, ... } });
 */
export const useUpdateProfile = () => {
  const queryClient    = useQueryClient();
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: ({ userId, payload }) => userService.updateProfile(userId, payload),
    onSuccess: (updatedUser) => {
      // Sync auth store
      updateUser?.(updatedUser);
      // Bust profile cache
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile(updatedUser.id) });
    },
  });
};
