import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";   // ← use hook, not raw context
import { getUserById, updateUserProfile } from "@/services/profileService";

const useProfile = () => {
  const { user, updateUser } = useAuth();           // ← updateUser from context

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserById(user.id);
      setProfile(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateUserProfile(user.id, profileData);
      setProfile(updated);
      // Sync firstName + lastName into AuthContext + localStorage
      updateUser({ firstName: updated.firstName, lastName: updated.lastName });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, success, updateProfile, fetchProfile };
};

export default useProfile;