import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { PATHS } from "@/routes/paths";

/**
 * ForgotPassword — 3-step identity verification flow.
 *
 * Step 1: Enter email
 * Step 2: Enter registered phone number (verification factor)
 * Step 3: Set new password
 *
 * No SMS / OTP / Twilio. Phone is verified locally against what the
 * backend returns for that email. This is a frontend-only verification
 * gate — the actual password update is sent to the backend in step 3.
 */

const STEPS = {
  EMAIL: 1,
  PHONE: 2,
  RESET: 3,
  SUCCESS: 4,
};

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep]           = useState(STEPS.EMAIL);
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [serverError, setServerError] = useState("");

  // ── Step 1: Verify email exists ────────────────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Enter a valid email";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      // Backend call: verify email exists
      const { verifyEmailForReset } = await import("@/services/authService");
      await verifyEmailForReset(email.trim());
      setStep(STEPS.PHONE);
    } catch (err) {
      setServerError(err.message || "No account found with this email.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify phone number ────────────────────────────────────────
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = {};
    if (!phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(phone.trim())) errs.phone = "Enter a valid 10-digit number";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { verifyPhoneForReset } = await import("@/services/authService");
      await verifyPhoneForReset(email.trim(), phone.trim());
      setStep(STEPS.RESET);
    } catch (err) {
      setServerError(err.message || "Phone number does not match our records.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Set new password ───────────────────────────────────────────
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "At least 6 characters";
    if (!confirm) errs.confirm = "Please confirm your password";
    else if (confirm !== password) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { resetPassword } = await import("@/services/authService");
      await resetPassword({ email: email.trim(), phone: phone.trim(), newPassword: password });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      setServerError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["Email", "Verify Identity", "New Password"];
  const currentStepIndex = step - 1; // 0-based for display

  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-lg"
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Forgot Password</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            We'll verify your identity before resetting your password.
          </p>
        </div>

        {/* Step indicator — only show for steps 1-3 */}
        {step !== STEPS.SUCCESS && (
          <div className="mb-6 flex items-center gap-2">
            {stepLabels.map((label, idx) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors"
                  style={{
                    backgroundColor: idx < currentStepIndex ? "var(--accent)" : idx === currentStepIndex ? "var(--accent)" : "var(--bg-tertiary)",
                    color: idx <= currentStepIndex ? "var(--accent-text)" : "var(--text-secondary)",
                  }}
                >
                  {idx < currentStepIndex ? "✓" : idx + 1}
                </div>
                <span className="text-center text-[10px]" style={{ color: idx === currentStepIndex ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Step 1: Email ───────────────────────────────────────────── */}
        {step === STEPS.EMAIL && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            {serverError && <p className="text-sm" style={{ color: "var(--error-text)" }}>{serverError}</p>}
            <Button type="submit" fullWidth loading={loading}>Continue</Button>
            <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              <Link to={PATHS.LOGIN} className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
                Back to Login
              </Link>
            </p>
          </form>
        )}

        {/* ── Step 2: Phone Verification ──────────────────────────────── */}
        {step === STEPS.PHONE && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Enter the phone number registered with <strong style={{ color: "var(--text-primary)" }}>{email}</strong>.
            </p>
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />
            {serverError && <p className="text-sm" style={{ color: "var(--error-text)" }}>{serverError}</p>}
            <Button type="submit" fullWidth loading={loading}>Verify Identity</Button>
            <button
              type="button"
              onClick={() => { setStep(STEPS.EMAIL); setServerError(""); }}
              className="w-full text-center text-sm hover:underline"
              style={{ color: "var(--text-secondary)" }}
            >
              ← Back
            </button>
          </form>
        )}

        {/* ── Step 3: Set New Password ────────────────────────────────── */}
        {step === STEPS.RESET && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <Input
              label="New Password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Input
              label="Confirm New Password"
              name="confirm"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
            />
            {serverError && <p className="text-sm" style={{ color: "var(--error-text)" }}>{serverError}</p>}
            <Button type="submit" fullWidth loading={loading}>Set New Password</Button>
          </form>
        )}

        {/* ── Step 4: Success ─────────────────────────────────────────── */}
        {step === STEPS.SUCCESS && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: "var(--success-bg)" }}>
              <svg className="h-8 w-8" style={{ color: "var(--success-text)" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Password Reset!</h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Button fullWidth onClick={() => navigate(PATHS.LOGIN)}>Go to Login</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
