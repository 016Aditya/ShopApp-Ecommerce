import { createContext, useContext, useState, useCallback } from "react";
import { login, register, logout } from "@/services/authService";
import { getStoredUser, setStoredUser, removeStoredUser } from "@/utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleLogin = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(credentials);
      setStoredUser(data);
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(userData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    removeStoredUser();
    setUser(null);
  }, []);

  // ✅ ADD: expose updateUser so profile changes sync everywhere
  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const updated = { ...prev, ...partial };
      setStoredUser(updated);          // keep localStorage in sync too
      return updated;
    });
  }, []);

  const value = {
    user,
    updateUser,                        // ✅ NEW — used by useProfile
    isLoggedIn: !!user,
    isAdmin: user?.role === "ADMIN",
    loading,
    error,
    login:    handleLogin,
    register: handleRegister,
    logout:   handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}