/**
 * ForgotPassword.jsx
 *
 * Multi-step password recovery flow — UI upgraded.
 * Business logic: UNCHANGED.
 *   Step 1 — Enter Email
 *   Step 2 — Enter Phone Number (verification)
 *   Step 3 — navigate to Reset Password
 */
import { useState }           from "react";
import { Link, useNavigate }  from "react-router-dom";
import toast                  from "react-hot-toast";
import { PATHS }              from "@/routes/paths";
import { useAuthStore }       from "@/store/authStore";
import Button                 from "@/components/common/Button";
import Input                  from "@/components/common/Input";

const STEPS = { EMAIL: 1, PHONE: 2 };
const PHONE_REGEX = /^[6-9]\d{9}$/;

function ForgotPassword() {
  const navigate = useNavigate();
  const users    = useAuthStore((s) => s.registeredUsers ?? []);

  const [step,  setStep]  = useState(STEPS.EMAIL);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Email is required."); return; }
    const match = users.find(
      (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
    );
    if (!match) { setError("No account found with this email address."); return; }
    setStep(STEPS.PHONE);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!phone.trim()) { setError("Phone number is required."); return; }
    if (!PHONE_REGEX.test(phone.trim())) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    const match = users.find(
      (u) =>
        u.email?.toLowerCase() === email.trim().toLowerCase() &&
        u.phone === phone.trim()
    );
    if (!match) {
      toast.error("Phone number does not match the account.");
      setError("Phone number does not match the account.");
      return;
    }
    navigate(PATHS.RESET_PASSWORD, { state: { email: email.trim(), verified: true } });
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
            {step === STEPS.EMAIL ? "Forgot Password" : "Verify Identity"}
          </h1>
          <p className="text-sm text-center" style={{ color: "var(--text-secondary)" }}>
            {step === STEPS.EMAIL
              ? "Enter your registered email address"
              : `Enter the phone registered with ${email}`}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-6">
          {[STEPS.EMAIL, STEPS.PHONE].map((s) => (
            <div
              key={s}
              className="h-1.5 flex-1 rounded-full transition-all duration-300"
              style={{ backgroundColor: step >= s ? "var(--accent)" : "var(--border-color)" }}
            />
          ))}
        </div>

        {step === STEPS.EMAIL && (
          <form onSubmit={handleEmailSubmit} noValidate className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              autoComplete="email"
            />

            {error && (
              <p
                className="rounded-xl px-3.5 py-2.5 text-sm"
                style={{
                  backgroundColor: "var(--error-bg)",
                  color: "var(--error-text)",
                  border: "1px solid var(--error-border)",
                }}
              >
                {error}
              </p>
            )}

            <Button type="submit" fullWidth size="lg"
              style={{
                backgroundColor: "var(--button-primary)",
                color: "var(--button-primary-text)",
                borderColor: "var(--button-primary)",
              }}
            >
              Continue
            </Button>

            <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              Remember your password?{" "}
              <Link to={PATHS.LOGIN} className="font-semibold hover:underline"
                style={{ color: "var(--accent)" }}>
                Sign in
              </Link>
            </p>
          </form>
        )}

        {step === STEPS.PHONE && (
          <form onSubmit={handlePhoneSubmit} noValidate className="space-y-4">
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(""); }}
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
            />

            {error && (
              <p
                className="rounded-xl px-3.5 py-2.5 text-sm"
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
                size="lg"
                onClick={() => { setError(""); setStep(STEPS.EMAIL); }}
              >
                Back
              </Button>
              <Button type="submit" fullWidth size="lg"
                style={{
                  backgroundColor: "var(--button-primary)",
                  color: "var(--button-primary-text)",
                  borderColor: "var(--button-primary)",
                }}
              >
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
