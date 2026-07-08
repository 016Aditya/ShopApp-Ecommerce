import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '../api/addressApi';
import { ADDRESS_KEYS } from './useAddresses';

/**
 * useDeleteAddress
 *
 * DELETE /api/v1/addresses/:id
 *
 * Removes the address from cache optimistically.
 * Invalidates the full list because the backend may promote a new default
 * when the deleted address was the default one.
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => addressApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(ADDRESS_KEYS.lists(), (old = []) =>
        old.filter((a) => a.id !== id)
      );
      // Invalidate to pick up any server-promoted default
      queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.lists() });
    },
  });
};
