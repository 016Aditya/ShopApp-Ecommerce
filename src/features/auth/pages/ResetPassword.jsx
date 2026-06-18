/**
 * ResetPassword.jsx
 *
 * Final step of the Forgot Password flow.
 * Only reachable via navigate(PATHS.RESET_PASSWORD, { state: { verified: true } }).
 * Direct URL access without state redirects to /forgot-password.
 */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/common/Button";
import Input  from "@/components/common/Input";

function ResetPassword() {
  const location = useLocation();
  const navigate  = useNavigate();
  const updateRegisteredUser = useAuthStore((s) => s.updateRegisteredUser);

  const { email, verified } = location.state ?? {};

  // Guard: must arrive here with verified state
  if (!verified || !email) {
    navigate(PATHS.FORGOT_PASSWORD, { replace: true });
    return null;
  }

  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState(false);

  const validate = () => {
    if (!password.trim())             { setError("Password is required."); return false; }
    if (password.length < 6)          { setError("Password must be at least 6 characters."); return false; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return false; }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    // Update password in the registered users list (client-side store).
    // In production this would call a backend API endpoint.
    updateRegisteredUser?.(email, { password });
    setSuccess(true);
  };

  if (success) {
    return (
      <div
        className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div
          className="w-full max-w-md space-y-6 rounded-2xl p-6 shadow-lg text-center"
          style={{
            backgroundColor: "var(--card-bg-elevated)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="text-5xl">✅</div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Password Reset Successful
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Your password has been updated. You can now log in with your new password.
          </p>
          <Button fullWidth onClick={() => navigate(PATHS.LOGIN, { replace: true })}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl p-6 shadow-lg"
        style={{
          backgroundColor: "var(--card-bg-elevated)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Set New Password
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Choose a strong new password for{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {email}
            </span>
            .
          </p>
        </div>

        <Input
          label="New Password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your new password"
          value={confirmPassword}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && (
          <p
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              backgroundColor: "var(--error-bg)",
              color: "var(--error-text)",
              border: "1px solid var(--error-border)",
            }}
          >
            {error}
          </p>
        )}

        <Button type="submit" fullWidth>
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;
