import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { addressApi } from '../api/addressApi';
import { toFormShape } from '../utils/addressMapper';

/**
 * ADDRESS_KEYS
 *
 * Centralised TanStack Query key factory for the address feature.
 * Every hook in this folder imports from here so invalidations are consistent.
 */
export const ADDRESS_KEYS = {
  all:    ['addresses'],
  lists:  () => [...ADDRESS_KEYS.all, 'list'],
  detail: (id) => [...ADDRESS_KEYS.all, 'detail', id],
};

/**
 * useAddresses
 *
 * Fetches the authenticated user's saved addresses from GET /api/v1/addresses.
 * Returns data already normalised to form shape via toFormShape().
 *
 * enabled: !!userId guard is critical — authStore.user is null for ~1 render
 * cycle while Zustand rehydrates from localStorage. Without this guard the
 * hook fires an unauthenticated request on first page load.
 */
export const useAddresses = () => {
  const userId = useAuthStore((s) => s.user?.id ?? null);

  return useQuery({
    queryKey: ADDRESS_KEYS.lists(),
    queryFn: async () => {
      const { data } = await addressApi.getAll();
      return (data ?? []).map(toFormShape);
    },
    enabled:   !!userId,
    staleTime: 1000 * 60 * 5,   // 5 min — addresses change infrequently
  });
};
