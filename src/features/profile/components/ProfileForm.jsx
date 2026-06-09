import { useState, useEffect } from "react";
import useProfile from "../hooks/useProfile";

const ProfileForm = () => {
  const { profile, loading, error, success, updateProfile } = useProfile();

  const [form, setForm] = useState({ firstName: "", lastName: "" });

  // Pre-fill form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName ?? "",
        lastName:  profile.lastName  ?? "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ firstName: form.firstName, lastName: form.lastName });
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2 className="profile-form__title">Personal Information</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName" name="firstName" type="text"
            className="input" value={form.firstName}
            onChange={handleChange} required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName" name="lastName" type="text"
            className="input" value={form.lastName}
            onChange={handleChange} required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email" className="input"
          value={profile?.email ?? ""}
          disabled
          aria-label="Email (read-only)"
        />
        <small className="input-hint">Email cannot be changed</small>
      </div>

      {error   && <p className="error-text">{error}</p>}
      {success && <p className="success-text">Profile updated successfully!</p>}

      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default ProfileForm;