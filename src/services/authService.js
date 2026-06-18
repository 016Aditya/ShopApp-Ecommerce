import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// POST /api/users/register
export const register = async ({ firstName, lastName, phone, email, password }) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/register`, {
    firstName,
    lastName,
    phone,
    email,
    password,
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

// Client-side logout
export const logout = () => {
  localStorage.removeItem("user");
};

// ── Forgot Password flow ───────────────────────────────────────────────────────

// POST /api/users/forgot-password/verify-email
// Verifies the email exists in the system
export const verifyEmailForReset = async (email) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/forgot-password/verify-email`, { email });
  return data;
};

// POST /api/users/forgot-password/verify-phone
// Verifies the phone matches the account associated with that email
export const verifyPhoneForReset = async (email, phone) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/forgot-password/verify-phone`, { email, phone });
  return data;
};

// POST /api/users/forgot-password/reset
// Sets the new password after both email + phone verified
export const resetPassword = async ({ email, phone, newPassword }) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/forgot-password/reset`, {
    email,
    phone,
    newPassword,
  });
  return data;
};
