import api from '@/api/api';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

/**
 * authService
 *
 * All functions are thin wrappers over the Axios instance.
 * Field-name mapping from frontend state → backend DTO happens here,
 * keeping LoginForm / RegisterForm free of backend coupling.
 *
 * Backend endpoint: POST /api/users/register
 * Backend DTO (UserDto.Request):
 *   firstName    @NotBlank
 *   lastName     @NotBlank
 *   email        @Email @NotBlank
 *   password     @NotBlank @Size(min=8)
 *   phoneNumber  @NotBlank @Pattern(10 digits)
 *
 * Backend endpoint: POST /api/users/login
 * Backend DTO (LoginRequest — inline in UserController):
 *   email
 *   password
 *
 * Backend response (UserDto.Response — flat object):
 *   { id, firstName, lastName, email, role, createdAt }
 *   NOTE: No JWT token field yet. token will be null in authStore.
 */

// POST /api/users/register
export const register = async ({ firstName, lastName, phone, phoneNumber, email, password }) => {
  // Support both `phone` (from RegisterForm split) and `phoneNumber` (direct)
  const resolvedPhone = phoneNumber ?? phone ?? '';

  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/register`, {
    firstName,
    lastName,
    email,
    password,
    phoneNumber: resolvedPhone,   // backend DTO field name
  });
  return data;
};

// POST /api/users/login
export const login = async ({ email, password }) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/login`, { email, password });
  return data;
};

// GET /api/users/:id
export const getUserById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.AUTH}/${id}`);
  return data;
};

// PUT /api/users/:id
export const updateProfile = async (id, { firstName, lastName, password }) => {
  const { data } = await api.put(`${API_ENDPOINTS.AUTH}/${id}`, { firstName, lastName, password });
  return data;
};

// Client-side logout — no backend call needed (no JWT to revoke yet)
export const logout = () => {
  // Nothing to clear server-side until JWT is implemented
};

// ── Forgot Password flow ───────────────────────────────────────────────────────

/**
 * Step 1 — POST /api/users/forgot-password
 * Verify the email exists. Backend returns generic OK regardless.
 */
export const verifyEmailForReset = async (email) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/forgot-password`, { email });
  return data;
};

/**
 * Step 2 — POST /api/users/verify-identity
 * Verify email + phone match. Returns { verified: boolean, message }.
 */
export const verifyPhoneForReset = async (email, phone) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/verify-identity`, {
    email,
    phoneNumber: phone,   // backend DTO field name
  });
  return data;
};

/**
 * Step 3 — POST /api/users/reset-password
 * Set new password after identity verified.
 */
export const resetPassword = async ({ email, phone, newPassword }) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/reset-password`, {
    email,
    phoneNumber: phone,   // backend DTO field name
    newPassword,
  });
  return data;
};
