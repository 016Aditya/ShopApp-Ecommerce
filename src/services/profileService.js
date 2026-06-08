import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getProfile = async (userId) => {
  const { data } = await api.get(`${API_ENDPOINTS.PROFILE}/${userId}`);
  return data;
};

export const updateProfileDetails = async (userId, payload) => {
  const { data } = await api.put(`${API_ENDPOINTS.PROFILE}/${userId}`, payload);
  return data;
};

export const changePassword = async (userId, payload) => {
  const { data } = await api.patch(`${API_ENDPOINTS.PROFILE}/${userId}/password`, payload);
  return data;
};