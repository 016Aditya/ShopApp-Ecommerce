import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatLockoutDuration(totalSeconds = 0) {
  const seconds = Math.max(toNumber(totalSeconds, 0), 0);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  if (minutes > 0 && remainder > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ${remainder} second${remainder === 1 ? '' : 's'}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  return `${seconds} second${seconds === 1 ? '' : 's'}`;
}

export function getFriendlyLoginMessage({ code, remainingSeconds }) {
  switch (code) {
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password.';
    case 'ACCOUNT_LOCKED':
      return `Your account is temporarily locked. Try again in ${formatLockoutDuration(remainingSeconds)}.`;
    case 'RATE_LIMIT_EXCEEDED':
      return 'Too many login attempts. Please try again later.';
    default:
      return 'Unable to sign in right now. Please try again.';
  }
}

function extractSecurityPayload(error) {
  const payload = error?.response?.data ?? {};
  const code =
    payload.code ??
    payload.errorCode ??
    payload.error?.code ??
    null;

  const remainingSeconds = toNumber(
    payload.remainingSeconds ??
    payload.retryAfterSeconds ??
    payload.details?.remainingSeconds ??
    payload.retryAfter,
    0
  );

  const lockoutCount = toNumber(
    payload.lockoutCount ??
    payload.details?.lockoutCount,
    0
  );

  return {
    code,
    remainingSeconds,
    lockoutCount,
    retryAfter: payload.retryAfter ?? null,
    isLocked: code === 'ACCOUNT_LOCKED' && remainingSeconds > 0,
  };
}

export function useLoginMutation() {
  const login = useAuthStore((state) => state.login);
  const clearError = useAuthStore((state) => state.clearError);
  const setError = useAuthStore((state) => state.setError);
  const setLoginSecurity = useAuthStore((state) => state.setLoginSecurity);
  const clearLoginSecurity = useAuthStore((state) => state.clearLoginSecurity);
  const isLocked = useAuthStore((state) => state.isLocked);
  const remainingSeconds = useAuthStore((state) => state.remainingSeconds);
  const tickLoginSecurity = useAuthStore((state) => state.tickLoginSecurity);

  useEffect(() => {
    if (!isLocked || remainingSeconds <= 0) return undefined;

    const timer = window.setInterval(() => {
      tickLoginSecurity();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isLocked, remainingSeconds, tickLoginSecurity]);

  return useMutation({
    mutationFn: login,
    onMutate: () => {
      clearError();
      clearLoginSecurity();
    },
    onSuccess: () => {
      clearError();
      clearLoginSecurity();
    },
    onError: (error) => {
      const security = extractSecurityPayload(error);
      setLoginSecurity(security);
      setError(
        getFriendlyLoginMessage({
          code: security.code,
          remainingSeconds: security.remainingSeconds,
        })
      );
    },
  });
}

