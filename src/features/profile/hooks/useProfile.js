import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/services/profileService";

const useProfile = () => {
  const { user, updateUser } = useAuth();

  // profile stays null when GET /users/:id is unavailable;
  // ProfileForm falls back to AuthContext user data in that case.
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  // fetchProfile is kept for components that explicitly need a refresh,
  // but it is NO LONGER called automatically on mount — we skip the
  // GET /users/:id call entirely because the endpoint does not exist
  // in this backend. The form pre-fills from AuthContext instead.
  const fetchProfile = useCallback(async () => {
    // no-op: endpoint unavailable
  }, []);

  const updateProfile = async (profileData) => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateUserProfile(user.id, profileData);
      setProfile(updated);
      // Sync all editable fields back into AuthContext + localStorage
      updateUser({
        firstName:   updated.firstName   ?? profileData.firstName,
        lastName:    updated.lastName    ?? profileData.lastName,
        phoneNumber: updated.phoneNumber ?? profileData.phoneNumber,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, success, updateProfile, fetchProfile };
};

export default useProfile;
