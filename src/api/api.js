import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor — attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
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

// ── Response interceptor — handle expired / invalid token ────────────────────
//
// When the backend returns 401 it means one of:
//   a) No token was sent (missed header) — shouldn't happen after login
//   b) Token is expired or invalid — JwtAuthFilter now returns 401 directly
//
// In both cases the correct action is to clear all auth state and send the
// user back to /login. Without this, the user appears "logged in" in the UI
// but every protected request (POST /api/orders, etc.) silently returns 401.
//
// Guard: skip auto-logout if the 401 came from /login or /register themselves
// (bad credentials should show an inline error, not redirect to /login).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';

    const isAuthEndpoint =
      requestUrl.includes('/users/login') ||
      requestUrl.includes('/users/register') ||
      requestUrl.includes('/users/forgot-password') ||
      requestUrl.includes('/users/verify-identity') ||
      requestUrl.includes('/users/reset-password');

    if (status === 401 && !isAuthEndpoint) {
      // Clear all persisted auth state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Clear Zustand persist key so rehydration doesn't restore the stale token
      localStorage.removeItem('auth-storage');

      // Redirect to login with a flag so the page can show a helpful message
      const alreadyOnLogin = window.location.pathname === '/login';
      if (!alreadyOnLogin) {
        window.location.href = '/login?session=expired';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
