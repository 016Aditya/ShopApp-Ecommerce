import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '../api/addressApi';
import { toRequestBody, toFormShape } from '../utils/addressMapper';
import { ADDRESS_KEYS } from './useAddresses';

/**
 * useUpdateAddress
 *
 * PUT /api/v1/addresses/:id
 *
 * Optimistically patches the specific address in cache.
 * Invalidates if defaultAddress changed so other addresses' default
 * flags are also refreshed from the server.
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) =>
      addressApi.update(id, toRequestBody(formData)),
    onSuccess: ({ data }) => {
      queryClient.setQueryData(ADDRESS_KEYS.lists(), (old = []) =>
        old.map((a) => (a.id === data.id ? toFormShape(data) : a))
      );
      if (data.defaultAddress) {
        queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.lists() });
      }
    },
  });
};
