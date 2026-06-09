import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";

// GET /api/users/:id
export const getUserById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
  return data;
};

// PUT /api/users/:id — body: { firstName, lastName, password }
export const updateUserProfile = async (id, profileData) => {
  const { data } = await api.put(`${API_ENDPOINTS.USERS}/${id}`, profileData);
  return data;
};

// DELETE /api/users/:id
export const deleteUser = async (id) => {
  await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
};