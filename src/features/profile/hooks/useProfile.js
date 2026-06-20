import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/services/profileService";

const useProfile = () => {
  const { user, updateUser } = useAuth();

  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(false);

  // fetchProfile kept as a no-op for components that call it explicitly.
  const fetchProfile = useCallback(async () => {}, []);

  const updateProfile = async (profileData) => {
    // Guard: user must be in context and have a valid id.
    const userId = user?.id ?? user?._id;
    if (!userId) {
      setError("Session expired. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await updateUserProfile(userId, profileData);
      setProfile(updated);

      // Sync all editable fields back into AuthContext + localStorage.
      updateUser({
        firstName:   updated.firstName   ?? profileData.firstName,
        lastName:    updated.lastName    ?? profileData.lastName,
        phoneNumber: updated.phoneNumber ?? profileData.phoneNumber,
      });
      setSuccess(true);
    } catch (err) {
      // Backend returns { error: "..." } — NOT { message: "..." }.
      // Also handle 422 validation errors which have { error, errors }.
      const backendMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      setError(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, success, updateProfile, fetchProfile };
};

export default useProfile;
