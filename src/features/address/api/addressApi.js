import api from '@/api/api';          // shared axios instance — JWT interceptor + 401 auto-logout
import { ADDRESSES } from '@/api/apiEndpoints';

// All requests resolve to /api/v1/addresses/...
// because ADDRESSES.list() returns '/v1/addresses' and Axios baseURL = /api

export const addressApi = {
  getAll:     ()           => api.get(ADDRESSES.list()),
  getOne:     (id)         => api.get(ADDRESSES.detail(id)),
  create:     (data)       => api.post(ADDRESSES.create(), data),
  update:     (id, data)   => api.put(ADDRESSES.update(id), data),
  remove:     (id)         => api.delete(ADDRESSES.delete(id)),
  setDefault: (id)         => api.patch(ADDRESSES.setDefault(id)),
};
