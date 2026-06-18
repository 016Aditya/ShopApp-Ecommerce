/**
 * ForgotPassword.jsx
 *
 * Multi-step password recovery flow:
 *   Step 1 — Enter Email
 *   Step 2 — Enter Phone Number (verification)
 *   Step 3 — Identity confirmed; navigate to Reset Password
 *
 * No SMS / OTP / Twilio. Phone is used only as a local verification factor
 * against the registered phone stored in authStore.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/common/Button";
import Input  from "@/components/common/Input";

const STEPS = {
  EMAIL:  1,
  PHONE:  2,
  VERIFY: 3,
};

const PHONE_REGEX = /^[6-9]\d{9}$/;

function ForgotPassword() {
  const navigate = useNavigate();
  const users = useAuthStore((s) => s.registeredUsers ?? []);

  const [step,  setStep]  = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // Step 1 — verify email exists
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required."); return; }
    const match = users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase());
    if (!match) { setError("No account found with this email address."); return; }
    setStep(STEPS.PHONE);
  };

  // Step 2 — verify phone matches
  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!phone.trim()) { setError("Phone number is required."); return; }
    if (!PHONE_REGEX.test(phone.trim())) { setError("Enter a valid 10-digit mobile number."); return; }
    const match = users.find(
      (u) => u.email?.toLowerCase() === email.trim().toLowerCase() && u.phone === phone.trim()
    );
    if (!match) { setError("Phone number does not match the account."); return; }
    // Identity verified — navigate to reset with token-like state
    navigate(PATHS.RESET_PASSWORD, { state: { email: email.trim(), verified: true } });
  };

  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="w-full max-w-md space-y-6 rounded-2xl p-6 shadow-lg"
        style={{
          backgroundColor: "var(--card-bg-elevated)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-2">
          {[STEPS.EMAIL, STEPS.PHONE, STEPS.VERIFY].map((s) => (
            <div
              key={s}
              className="h-1.5 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  step >= s ? "var(--accent)" : "var(--border-color)",
              }}
            />
          ))}
        </div>

        {step === STEPS.EMAIL && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Forgot Password
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                Enter your registered email address.
              </p>
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Continue
            </Button>

            <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              Remember your password?{" "}
              <Link
                to={PATHS.LOGIN}
                className="font-medium hover:underline"
                style={{ color: "var(--accent)" }}
              >
                Login
              </Link>
            </p>
          </form>
        )}

        {step === STEPS.PHONE && (
          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                Verify Identity
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                Enter the phone number registered with{" "}
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {email}
                </span>
                .
              </p>
            </div>

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              inputMode="numeric"
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

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => { setError(""); setStep(STEPS.EMAIL); }}
              >
                Back
              </Button>
              <Button type="submit" fullWidth>
                Verify
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
