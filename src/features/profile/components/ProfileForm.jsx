import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import useProfile from "../hooks/useProfile";

const ProfileForm = () => {
  const { user } = useAuth();
  const { profile, loading, error, success, updateProfile } = useProfile();

  const [form, setForm] = useState({
    firstName:   "",
    lastName:    "",
    phoneNumber: "",
  });

  // Pre-fill from profile (API) first; fall back to AuthContext user
  useEffect(() => {
    const src = profile ?? user ?? {};
    setForm({
      firstName:   src.firstName   ?? "",
      lastName:    src.lastName    ?? "",
      phoneNumber: src.phoneNumber ?? "",
    });
  }, [profile, user]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      firstName:   form.firstName,
      lastName:    form.lastName,
      phoneNumber: form.phoneNumber,
    });
  };

  // Email is always available from AuthContext (populated at login)
  const email = user?.email ?? profile?.email ?? "";

  return (
    <form onSubmit={handleSubmit}>

      {/* First / Last row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="firstName"
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className="input rounded-lg px-3 py-2.5 text-sm w-full"
            style={{
              border: "1px solid var(--input-border)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
            value={form.firstName}
            onChange={handleChange}
            required
            placeholder="First name"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="lastName"
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className="input rounded-lg px-3 py-2.5 text-sm w-full"
            style={{
              border: "1px solid var(--input-border)",
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
            }}
            value={form.lastName}
            onChange={handleChange}
            required
            placeholder="Last name"
          />
        </div>
      </div>

      {/* Email (read-only — always from AuthContext) */}
      <div className="flex flex-col gap-1 mb-4">
        <label
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-secondary)" }}
        >
          Email
        </label>
        <input
          type="email"
          className="input rounded-lg px-3 py-2.5 text-sm w-full opacity-60 cursor-not-allowed"
          style={{
            border: "1px solid var(--input-border)",
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
          value={email}
          disabled
          aria-label="Email (read-only)"
          readOnly
        />
        <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          Email address cannot be changed
        </p>
      </div>

      {/* Phone Number */}
      <div className="flex flex-col gap-1 mb-5">
        <label
          htmlFor="phoneNumber"
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-secondary)" }}
        >
          Phone Number
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          className="input rounded-lg px-3 py-2.5 text-sm w-full"
          style={{
            border: "1px solid var(--input-border)",
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="e.g. 9876543210"
          maxLength={15}
        />
        <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          Used for delivery notifications and order updates
        </p>
      </div>

      {/* Feedback */}
      {error   && <p className="text-sm mb-3" style={{ color: "var(--error-text)" }}>{error}</p>}
      {success && <p className="text-sm mb-3" style={{ color: "var(--success-text)" }}>Profile updated successfully!</p>}

      {/* Save button */}
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
          e.currentTarget.style.backgroundColor = loading
            ? "var(--button-primary)"
            : "var(--button-primary)";
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Saving…
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
};

export default ProfileForm;
