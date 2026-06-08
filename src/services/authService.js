import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const register = async (userData) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/register`, userData);
  return data;
};

export const login = async (credentials) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/login`, credentials);
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.AUTH}/${id}`);
  return data;
};

export const updateProfile = async (id, profileData) => {
  const { data } = await api.put(`${API_ENDPOINTS.AUTH}/${id}`, profileData);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};