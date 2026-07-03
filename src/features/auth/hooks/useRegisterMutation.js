import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

export function useRegisterMutation() {
  const register = useAuthStore((state) => state.register);
  const clearError = useAuthStore((state) => state.clearError);

  return useMutation({
    mutationFn: register,
    onMutate: () => {
      clearError();
    },
  });
}

