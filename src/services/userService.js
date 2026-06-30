import api from '@/api/api';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

export const userService = {
  /**
   * GET /api/users/:id
   * Returns UserDto.Response — includes address and fullName.
   */
  getUserProfile: async (userId) => {
    const { data } = await api.get(`${API_ENDPOINTS.USERS}/${userId}`);
    return data;
  },

  /**
   * PUT /api/users/:id
   * Payload shape must match UserDto.UpdateProfileRequest:
   * {
   *   firstName:   string,
   *   lastName:    string,
   *   phoneNumber: string | undefined,
   *   password:    string | undefined,
   *   address: {
   *     fullName, phoneNumber, addressLine1, addressLine2,
   *     city, state, zipCode, country
   *   } | undefined
   * }
   * Returns updated UserDto.Response.
   */
  updateProfile: async (userId, payload) => {
    const { data } = await api.put(`${API_ENDPOINTS.USERS}/${userId}`, payload);
    return data;
  },

  /**
   * GET /api/users/:id/addresses  (future endpoint)
   * Kept as a stub so imports don't break when this route is added.
   */
  getAddresses: async (userId) => {
    const { data } = await api.get(`${API_ENDPOINTS.USERS}/${userId}/addresses`);
    return data;
  },
};
