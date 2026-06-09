import { useCallback, useEffect, useState } from "react";
import useAuth from "@/features/auth/hooks/useAuth";
import { getUserById, updateProfile } from "@/services/profileService";

function useProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUserById(user.id);
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = async (profileData) => {
    if (!user?.id) return null;

    setSaving(true);
    setError(null);

    try {
      const updated = await updateProfile(user.id, profileData);
      setProfile(updated);

      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser) {
        const mergedUser = { ...storedUser, ...updated };
        localStorage.setItem("user", JSON.stringify(mergedUser));
      }

      return updated;
    } catch (err) {
      setError(err.message || "Failed to update profile");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    refetchProfile: fetchProfile,
    saveProfile,
  };
}

export default useProfile;