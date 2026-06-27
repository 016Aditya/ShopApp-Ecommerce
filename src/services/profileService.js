import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// GET /api/users/:id
export const getUserById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
  return data;
};

/**
 * updateUserProfile (original name — kept for any legacy callers)
 * updateProfile     (alias — used by ProfileForm.jsx)
 * Both call PUT /api/users/:id
 */
export const updateUserProfile = async (id, profileData) => {
  const { data } = await api.put(`${API_ENDPOINTS.USERS}/${id}`, profileData);
  return data;
};

// Alias consumed by ProfileForm: import { updateProfile } from '@/services/profileService'
export const updateProfile = updateUserProfile;

/**
 * changePassword
 * Called by PasswordForm: import { changePassword } from '@/services/profileService'
 * Calls PUT /api/users/:id/change-password
 * Body: { currentPassword, newPassword }
 */
export const changePassword = async (id, passwords) => {
  const { data } = await api.put(
    `${API_ENDPOINTS.USERS}/${id}/change-password`,
    passwords
  );
  return data;
};

// DELETE /api/users/:id
export const deleteUser = async (id) => {
  await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
};
