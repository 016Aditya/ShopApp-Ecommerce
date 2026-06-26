/**
 * interceptors.js
 *
 * Attaches request + response interceptors to the shared Axios instance.
 * Call attachInterceptors() once at app bootstrap (providers.jsx or main.jsx).
 *
 * Request  — injects JWT Authorization header from localStorage.
 * Response — on 401 (non-auth endpoint) clears all auth state and
 *            redirects to /login?session=expired.
 */
import apiClient from './axios';
import { AUTH_ENDPOINTS } from './endpoints';

export function attachInterceptors() {
  // ── Request: inject JWT ───────────────────────────────────────────────────
  apiClient.interceptors.request.use(
    (config) => {
      let token = localStorage.getItem('auth_token');
      if (token) {
        // Strip accidental surrounding quotes added by some state managers
        token = token.replace(/^"|"$/g, '');
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ── Response: handle expired / invalid token ──────────────────────────────
  //
  // 401 from /login or /register means bad credentials → show inline error.
  // 401 from any other endpoint means token expired → force re-login.
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const status     = error.response?.status;
      const requestUrl = error.config?.url ?? '';

      const isAuthEndpoint = Object.values(AUTH_ENDPOINTS).some((path) =>
        requestUrl.includes(path)
      );

      if (status === 401 && !isAuthEndpoint) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Clear Zustand persist key so rehydration doesn't restore stale token
        localStorage.removeItem('auth-storage');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session=expired';
        }
      }

      return Promise.reject(error);
    }
  );
}
