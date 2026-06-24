import axios from "axios";
import { API_BASE_URL } from "../utils/constants"; // Adjust path if needed

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a Request Interceptor
api.interceptors.request.use(
  (config) => {
    // 1. Grab the token directly from where authStore saves it!
    let token = localStorage.getItem('auth_token');

    // 2. If the token exists, attach it to the headers
    if (token) {
      // Sometimes tokens are saved with extra quotes (e.g., '"eyJhb..."') by state managers. 
      // This regex cleans them up safely so Spring Boot doesn't reject it.
      token = token.replace(/^"(.*)"$/, '$1');
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a Response Interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or unauthorized. Please log in again.");
      // Optional: Auto-logout user here if token expires
      // localStorage.removeItem('auth_token');
      // localStorage.removeItem('auth_user');
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;