import api from "@/api/api";
import { API_ENDPOINTS } from "@/api/apiEndpoints";


// POST /api/users/register
// Body: { firstName, lastName, email, password }
export const register = async ({ firstName, lastName, email, password }) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/register`, {
    firstName,
    lastName,
    email,
    password,
  });
  return data; // UserDto.Response: { id, firstName, lastName, email, role, createdAt }
};

// POST /api/users/login
// Body: { email, password }
export const login = async ({ email, password }) => {
  const { data } = await api.post(`${API_ENDPOINTS.AUTH}/login`, {
    email,
    password,
  });
  return data; // UserDto.Response
};

// GET /api/users/:id
export const getUserById = async (id) => {
  const { data } = await api.get(`${API_ENDPOINTS.AUTH}/${id}`);
  return data;
};

// PUT /api/users/:id
// Body: { firstName, lastName, password }
export const updateProfile = async (id, { firstName, lastName, password }) => {
  const { data } = await api.put(`${API_ENDPOINTS.AUTH}/${id}`, {
    firstName,
    lastName,
    password,
  });
  return data;
};

// Client-side logout — no backend logout endpoint exists yet
export const logout = () => {
  localStorage.removeItem("user");
};