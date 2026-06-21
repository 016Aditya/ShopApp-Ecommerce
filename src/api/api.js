import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { useAuthStore } from '@/store/authStore';

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor ──────────────────────────────────────────────────────
/**
 * Attach the JWT as Authorization: Bearer <token> on every request.
 *
 * Token resolution order:
 *   1. Zustand authStore (in-memory, always up-to-date after first render)
 *   2. localStorage['auth_token'] fallback — covers the brief pre-hydration
 *      window on page reload before Zustand has rehydrated from localStorage.
 *
 * The X-User-Id header has been removed. The backend now extracts userId
 * exclusively from the validated JWT — sending it as a header would be
 * redundant and could be forged by the client.
 */
api.interceptors.request.use(
  (config) => {
    const storeToken = useAuthStore.getState().token;
    const token = storeToken ?? localStorage.getItem('auth_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    // 401 — token missing / expired / invalid: clear auth state and redirect
    if (status === 401) {
      useAuthStore.getState().logout();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // 403 — authenticated but not authorised (e.g. accessing another user's order)
    if (status === 403) {
      console.warn('[api] Access denied:', error.response?.data);
    }

    // 500+ — server error
    if (status >= 500) {
      console.error('[api] Server error:', error.response?.data);
    }

    // Normalise error message from Spring Boot GlobalExceptionHandler
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong';

    error.message = serverMessage;

    return Promise.reject(error);
  }
);

export default api;
