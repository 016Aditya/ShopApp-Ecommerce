import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '../api/addressApi';
import { toRequestBody, toFormShape } from '../utils/addressMapper';
import { ADDRESS_KEYS } from './useAddresses';

/**
 * useCreateAddress
 *
 * POST /api/v1/addresses
 *
 * On success, appends the new address to the existing list cache so
 * the UI reflects the change immediately without a full refetch.
 *
 * If the new address has defaultAddress=true the backend clears the
 * existing default — the onSuccess below overwrites the full list from
 * the server response only for that entry; call queryClient.invalidateQueries
 * if you need to sync the cleared default on other addresses (optional).
 */
export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => addressApi.create(toRequestBody(formData)),
    onSuccess: ({ data }) => {
      queryClient.setQueryData(ADDRESS_KEYS.lists(), (old = []) => [
        ...old,
        toFormShape(data),
      ]);
      // If the new address is default, invalidate to sync cleared defaults
      if (data.defaultAddress) {
        queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.lists() });
      }
    },
  });
};
