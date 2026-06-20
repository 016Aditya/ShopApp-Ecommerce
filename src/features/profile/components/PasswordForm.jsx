import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserProfile } from "@/services/profileService";

const PasswordForm = () => {
  const { user } = useAuth();

  const [form, setForm]       = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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

  // Eye icon helper
  const EyeIcon = ({ open }) => open ? (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  ) : (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

  return (
    <form onSubmit={handleSubmit}>

      {/* New Password */}
      <div className="flex flex-col gap-1 mb-4">
        <label
          htmlFor="password"
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-secondary)" }}
        >
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPwd ? "text" : "password"}
            className="input rounded-lg px-3 py-2.5 text-sm w-full pr-10"
            style={{
              border: "1px solid var(--input-border)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Min. 6 characters"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-tertiary)" }}
            aria-label={showPwd ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPwd} />
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1 mb-5">
        <label
          htmlFor="confirm"
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-secondary)" }}
        >
          Confirm Password
        </label>
        <input
          id="confirm"
          name="confirm"
          type={showPwd ? "text" : "password"}
          className="input rounded-lg px-3 py-2.5 text-sm w-full"
          style={{
            border: "1px solid var(--input-border)",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
          value={form.confirm}
          onChange={handleChange}
          required
          placeholder="Re-enter new password"
        />
      </div>

      {/* Feedback */}
      {error   && <p className="text-sm mb-3" style={{ color: "var(--error-text)" }}>{error}</p>}
      {success && <p className="text-sm mb-3" style={{ color: "var(--success-text)" }}>Password changed successfully!</p>}

      {/* Change Password button */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--button-primary)",
          color: "var(--button-primary-text)",
        }}
        onMouseEnter={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = "var(--button-primary-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--button-primary)";
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Updating…
          </>
        ) : (
          "Change Password"
        )}
      </button>
    </form>
  );
};

export default PasswordForm;
