import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { login, register, updateProfile } from "@/services/authService";
import useLocalStorage from "@/hooks/useLocalStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Persist user in localStorage so refresh doesn't log them out
  const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage(
    "user",
    null
  );

  const [user, setUser] = useState(storedUser ?? null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Keep in-memory state in sync with localStorage on first mount
  useEffect(() => {
    setUser(storedUser ?? null);
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  // ─── Register ───────────────────────────────────────────────────────────────
  // POST /api/users/register
  // Expects: { firstName, lastName, email, password }
  // Returns: UserDto.Response { id, firstName, lastName, email, role, createdAt }
  const registerUser = useCallback(async (userData) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const newUser = await register(userData);
      setUser(newUser);
      setStoredUser(newUser);
      return newUser;
    } catch (err) {
      const message = err.message || "Registration failed";
      setAuthError(message);
      throw new Error(message);
    } finally {
      setAuthLoading(false);
    }
  }, [setStoredUser]);

  // ─── Login ───────────────────────────────────────────────────────────────────
  // POST /api/users/login
  // Expects: { email, password }
  // Returns: UserDto.Response { id, firstName, lastName, email, role, createdAt }
  const loginUser = useCallback(async (credentials) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const loggedInUser = await login(credentials);
      setUser(loggedInUser);
      setStoredUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      const message = err.message || "Login failed. Check your email and password.";
      setAuthError(message);
      throw new Error(message);
    } finally {
      setAuthLoading(false);
    }
  }, [setStoredUser]);

  // ─── Logout ──────────────────────────────────────────────────────────────────
  // No backend call needed yet (no JWT to invalidate)
  // Clears in-memory and localStorage state
  const logoutUser = useCallback(() => {
    setUser(null);
    removeStoredUser();
    setAuthError(null);
  }, [removeStoredUser]);

  // ─── Update Profile ───────────────────────────────────────────────────────────
  // PUT /api/users/{id}
  // Expects: { firstName, lastName, password }
  // Returns: UserDto.Response
  const updateUserProfile = useCallback(
    async (profileData) => {
      if (!user?.id) throw new Error("No user logged in");

      setAuthLoading(true);
      setAuthError(null);

      try {
        const updated = await updateProfile(user.id, profileData);

        // Merge updated fields back — keep any local fields the server
        // might not return (e.g., a future token field)
        const mergedUser = { ...user, ...updated };
        setUser(mergedUser);
        setStoredUser(mergedUser);
        return mergedUser;
      } catch (err) {
        const message = err.message || "Profile update failed";
        setAuthError(message);
        throw new Error(message);
      } finally {
        setAuthLoading(false);
      }
    },
    [user, setStoredUser]
  );

  // ─── Derived helpers ─────────────────────────────────────────────────────────
  const isLoggedIn = Boolean(user?.id);
  const isAdmin = user?.role === "ADMIN";

  // Memoize the value object so consumers only re-render when something
  // inside actually changes
  const value = useMemo(
    () => ({
      user,
      authLoading,
      authError,
      isLoggedIn,
      isAdmin,
      registerUser,
      loginUser,
      logoutUser,
      updateUserProfile,
      clearError,
    }),
    [
      user,
      authLoading,
      authError,
      isLoggedIn,
      isAdmin,
      registerUser,
      loginUser,
      logoutUser,
      updateUserProfile,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}