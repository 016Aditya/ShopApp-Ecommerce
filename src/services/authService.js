import api from '@/api/api';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

/**
 * authService
 *
 * Thin wrappers over the Axios instance.
 *
 * Backend response shape after JWT implementation:
 *
 *   POST /api/users/login  →  LoginResponse:
 *     {
 *       token: "<signed JWT>",
 *       user:  { id, firstName, lastName, email, phoneNumber, role, createdAt }
 *     }
 *
 *   The caller (authStore.login) receives { token, user } from this service
 *   and stores them separately in Zustand state + localStorage.
 */

// ── POST /api/users/register ───────────────────────────────────────────────────
export const register = async ({ firstName, lastName, phone, phoneNumber, email, password }) => {
  const resolvedPhone = phoneNumber ?? phone ?? '';

  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/register`, {
    firstName,
    lastName,
    email,
    password,
    phoneNumber: resolvedPhone,
  });
  return data;
};

// ── POST /api/users/login ──────────────────────────────────────────────────────
/**
 * Returns { token, user } from the backend LoginResponse.
 * token  — signed JWT; must be sent as Authorization: Bearer <token>
 * user   — UserDto.Response profile object (for UI state only)
 */
export const login = async ({ email, password }) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/login`, { email, password });
  // data shape: { token: string, user: { id, firstName, ... } }
  return data;
};

// ── GET /api/users/:id ─────────────────────────────────────────────────────────
export const getUserById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.AUTH}/${id}`);
  return data;
};

// ── PUT /api/users/:id ─────────────────────────────────────────────────────────
export const updateProfile = async (id, { firstName, lastName, phoneNumber, password }) => {
  const { data } = await api.put(`${API_ENDPOINTS.AUTH}/${id}`, {
    firstName,
    lastName,
    phoneNumber,
    password,
  });
  return data;
};

// ── Logout (client-side) ───────────────────────────────────────────────────────
/**
 * No backend call needed — JWT is stateless.
 * Clear the stored token so the Axios interceptor stops sending it.
 */
export const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// ── Forgot Password flow ───────────────────────────────────────────────────────

/** Step 1 — POST /api/users/forgot-password */
export const verifyEmailForReset = async (email) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/forgot-password`, { email });
  return data;
};

/** Step 2 — POST /api/users/verify-identity */
export const verifyPhoneForReset = async (email, phone) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/verify-identity`, {
    email,
    phoneNumber: phone,
  });
  return data;
};

/** Step 3 — POST /api/users/reset-password */
export const resetPassword = async ({ email, phone, newPassword }) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/reset-password`, {
    email,
    phoneNumber: phone,
    newPassword,
  });
  return data;
};
