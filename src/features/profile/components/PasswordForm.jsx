import { useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { updateUserProfile } from "@/services/profileService";

const PasswordForm = () => {
  const { user } = useContext(AuthContext);

  const [form, setForm]     = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile(user.id, { password: form.password });
      setSuccess(true);
      setForm({ password: "", confirm: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="password-form" onSubmit={handleSubmit}>
      <h2 className="password-form__title">Change Password</h2>

      <div className="form-group">
        <label htmlFor="password">New Password</label>
        <input
          id="password" name="password" type="password"
          className="input" value={form.password}
          onChange={handleChange} required minLength={6}
          placeholder="Min. 6 characters"
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirm">Confirm Password</label>
        <input
          id="confirm" name="confirm" type="password"
          className="input" value={form.confirm}
          onChange={handleChange} required
          placeholder="Re-enter new password"
        />
      </div>

      {error   && <p className="error-text">{error}</p>}
      {success && <p className="success-text">Password changed successfully!</p>}

      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
};

export default PasswordForm;