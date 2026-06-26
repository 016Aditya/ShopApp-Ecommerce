/**
 * axios.js
 *
 * Single Axios instance for the entire app.
 * - Base URL comes from config/env.js (single source of truth)
 * - Default Content-Type header
 * - NO interceptors here — see interceptors.js
 */
import axios from 'axios';
import { env } from '@/config/env';

const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
