import axios from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { useAuthStore } from "@/store/authStore";

// ─── Axios instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Read directly from Zustand store — works outside React components
    const { user, token } = useAuthStore.getState();

    if (user?.id) {
      config.headers["X-User-Id"] = user.id;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    // 401 — session invalid, clear Zustand store and redirect
    if (status === 401) {
      useAuthStore.getState().logout();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // 403 — not enough permissions
    if (status === 403) {
      console.warn("Access denied:", error.response?.data);
    }

    // 404 — resource not found (product, order, user)
    if (status === 404) {
      console.warn("Resource not found:", error.response?.data);
    }

    // 500+ — server error
    if (status >= 500) {
      console.error("Server error:", error.response?.data);
    }

    // Normalise error message from Spring Boot GlobalExceptionHandler
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong";

    error.message = serverMessage;

    return Promise.reject(error);
  }
);

export default api;
