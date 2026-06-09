import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// Get full user profile by id
export const getProfile = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.AUTH}/${id}`);
  return data;
};

// Update name, email, or any other profile field
export const updateProfile = async (id, profileData) => {
  const { data } = await api.put(`${API_ENDPOINTS.AUTH}/${id}`, profileData);
  return data;
};

// Change password — your backend expects { currentPassword, newPassword }
// Adjust the path to match your UserController exactly
export const changePassword = async (id, passwordData) => {
  const { data } = await api.patch(
    `${API_ENDPOINTS.AUTH}/${id}/password`,
    passwordData
  );
  return data;
};

// Delete account
export const deleteAccount = async (id) => {
  const { data } = await api.delete(`${API_ENDPOINTS.AUTH}/${id}`);
  return data;
};