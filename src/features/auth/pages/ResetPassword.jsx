/**
 * ResetPassword.jsx — UI upgraded.
 * Business logic: UNCHANGED.
 *
 * Adds:
 *   + PasswordField (eye toggle) on both fields
 *   + PasswordStrength meter + checklist
 *   + Live confirm-password match indicator
 *   + Submit disabled until password is valid + confirmed
 *   + app-wide success toast via toastStore
 *   + Loading label "Resetting password…"
 */
import { useState, useMemo }   from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PATHS }               from "@/routes/paths";
import Button                  from "@/components/common/Button";
import PasswordField           from "@/features/auth/components/PasswordField";
import PasswordStrength, { isPasswordValid } from "@/features/auth/components/PasswordStrength";
import { resetPassword as resetPasswordRequest } from "@/services/authService";
import { useToastStore }       from '@/store/toastStore';

function ResetPassword() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  const { email, phone, verified } = location.state ?? {};

  if (!verified || !email) {
    navigate(PATHS.FORGOT_PASSWORD, { replace: true });
    return null;
  }

  const [password,        setPassword]  = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [confirmTouched,  setConfirmTouched] = useState(false);
  const [loading,         setLoading]   = useState(false);

  const pwValid    = isPasswordValid(password);
  const pwMatch    = confirmPassword.length > 0 && password === confirmPassword;
  const pwMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const submitDisabled = useMemo(
    () => loading || !pwValid || !pwMatch,
    [loading, pwValid, pwMatch]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pwValid)  {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Password does not meet requirements.',
      });
      return;
    }
    if (!pwMatch)  {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Passwords do not match.',
      });
      return;
    }

    setLoading(true);
    try {
      await resetPasswordRequest({
        email,
        phone,
        newPassword: password,
      });
      showToast({
        type: 'success',
        title: 'Password Changed Successfully',
        message: '',
      });
      navigate(PATHS.LOGIN, { replace: true });
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-xl"
        style={{
          backgroundColor: "var(--card-bg-elevated)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Header */}
        <div className="mb-6 flex flex-col items-center gap-1">
          <div
            className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
          >
            S
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Set new password
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            For{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {email}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* New password + strength */}
          <div className="space-y-2">
            <PasswordField
              label="New Password"
              name="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <PasswordStrength password={password} />
          </div>

          {/* Confirm password + match indicator */}
          <div className="space-y-1.5">
            <PasswordField
              label="Confirm New Password"
              name="confirmPassword"
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => { setConfirm(e.target.value); setConfirmTouched(true); }}
              autoComplete="new-password"
            />
            {confirmTouched && confirmPassword.length > 0 && (
              <p
                className="flex items-center gap-1.5 text-xs"
                style={{ color: pwMatch ? "#22c55e" : "#ef4444" }}
              >
                <span className="font-bold">{pwMatch ? "✓" : "✗"}</span>
                {pwMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            disabled={submitDisabled}
            className="mt-1"
            style={!submitDisabled ? {
              backgroundColor: "var(--button-primary)",
              color: "var(--button-primary-text)",
              borderColor: "var(--button-primary)",
            } : {}}
          >
            {loading ? "Resetting password…" : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
