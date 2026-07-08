import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '../api/addressApi';
import { toFormShape } from '../utils/addressMapper';
import { ADDRESS_KEYS } from './useAddresses';

/**
 * useDefaultAddress
 *
 * PATCH /api/v1/addresses/:id/default
 *
 * Optimistically updates cache:
 *   - sets defaultAddress=true on the target
 *   - sets defaultAddress=false on all others
 * Backend is the source of truth; invalidation re-syncs if server-side
 * state diverges (e.g. race condition caught by partial unique index).
 */
export const useDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => addressApi.setDefault(id),
    onSuccess: ({ data: updated }) => {
      queryClient.setQueryData(ADDRESS_KEYS.lists(), (old = []) =>
        old.map((a) =>
          a.id === updated.id
            ? { ...toFormShape(updated), defaultAddress: true }
            : { ...a, defaultAddress: false }
        )
      );
    },
  });
};
