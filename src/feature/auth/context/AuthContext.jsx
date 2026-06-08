import { createContext, useState, useEffect, useCallback } from "react";
import { login, register, logout } from "@/services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token;

  // ── Login ────────────────────────────────────────────────────
  const handleLogin = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(credentials);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
    } catch (err) {
      setError(err.message || "Login failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Register ─────────────────────────────────────────────────
  const handleRegister = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(userData);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
    } catch (err) {
      setError(err.message || "Registration failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    setToken(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}