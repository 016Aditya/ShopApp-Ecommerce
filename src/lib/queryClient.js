import { QueryClient } from '@tanstack/react-query';

/**
 * isRetryable
 *
 * TanStack Query retry predicate.
 * We ONLY retry on:
 *   - Network failures (no response at all)
 *   - 5xx server errors
 *
 * We NEVER retry on:
 *   - 401 Unauthorized  → user needs to log in
 *   - 403 Forbidden     → user lacks permission
 *   - 404 Not Found     → resource does not exist
 *
 * @param {number}    failureCount  0-based attempt index
 * @param {unknown}   error         The thrown error (Axios error or plain Error)
 * @returns {boolean}
 */
function isRetryable(failureCount, error) {
  // Hard cap — never retry more than twice
  if (failureCount >= 2) return false;

  // Axios errors expose a `response` object when the server responded
  const status = error?.response?.status;

  // No response → network failure → retryable
  if (!status) return true;

  // 4xx client errors are not retryable (except we allow a retry on
  // transient 408 Request Timeout and 429 Too Many Requests)
  if (status === 401 || status === 403 || status === 404) return false;
  if (status >= 400 && status < 500 && status !== 408 && status !== 429) return false;

  // 5xx server errors are retryable
  return true;
}

/**
 * Exponential backoff with jitter.
 * attempt 0 → ~1 s, attempt 1 → ~2 s, capped at 10 s.
 *
 * @param {number} attempt  0-based
 * @returns {number} ms to wait before next attempt
 */
function retryDelay(attempt) {
  const base  = Math.min(1000 * 2 ** attempt, 10_000);
  const jitter = Math.random() * 300; // ±300 ms jitter to prevent thundering herd
  return base + jitter;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data is considered fresh. Components will not re-fetch
      // during this window even if they remount.
      staleTime: 5 * 60 * 1000, // 5 min default — overridden per-query where needed

      // How long INACTIVE (unmounted) query data stays in the cache before
      // being garbage-collected.
      gcTime: 15 * 60 * 1000, // 15 min

      // Smart retry — only network failures and 5xx errors
      retry: isRetryable,
      retryDelay,

      // Disable refetch-on-window-focus globally.
      // Products / catalogue data does not need to re-fetch every time the
      // user switches browser tabs. Overridden to `true` where freshness
      // matters more (e.g. Orders, Profile — handled in Phase 2B).
      refetchOnWindowFocus: false,

      // Re-fetch when a dropped network connection is restored.
      refetchOnReconnect: true,

      // Do NOT refetch on every remount if data is still fresh.
      refetchOnMount: true,
    },
    mutations: {
      // Mutations are user-initiated — never auto-retry.
      retry: 0,
    },
  },
});
