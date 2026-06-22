/**
 * RegisterForm — production-quality UI upgrade
 *
 * Changes vs previous version:
 *   + PasswordField with show/hide eye toggle on both password fields
 *   + Live password strength meter + checklist (PasswordStrength component)
 *   + Live confirm-password match indicator
 *   + Submit disabled until all password rules pass AND passwords match
 *   + react-hot-toast success and error toasts
 *   + Loading label "Creating account…" on button
 *   + Fully theme-variable styled — dark mode safe
 *
 * Business logic: UNCHANGED
 *   - validate() kept as-is (same rules + phone regex)
 *   - register() call, payload shape, navigate() all identical
 */
import { Link, useNavigate }    from "react-router-dom";
import { useState, useMemo }    from "react";
import toast                    from "react-hot-toast";
import Button                   from "@/components/common/Button";
import Input                    from "@/components/common/Input";
import PasswordField            from "./PasswordField";
import PasswordStrength, { isPasswordValid } from "./PasswordStrength";
import useAuth                  from "@/features/auth/hooks/useAuth";
import { PATHS }                from "@/routes/paths";

const PHONE_REGEX = /^[6-9]\d{9}$/;

function RegisterForm() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name:            "",
    phone:           "",
    email:           "",
    password:        "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched]       = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (formErrors[name]) setFormErrors((p) => ({ ...p, [name]: "" }));
    if (error) clearError?.();
  };

  // ── live derived state ────────────────────────────────────────────────────
  const pwValid    = isPasswordValid(formData.password);
  const pwMatch    = formData.confirmPassword.length > 0
    && formData.password === formData.confirmPassword;
  const pwMismatch = formData.confirmPassword.length > 0
    && formData.password !== formData.confirmPassword;

  const submitDisabled = useMemo(() => {
    if (loading) return true;
    if (!pwValid) return true;
    if (!pwMatch) return true;
    return false;
  }, [loading, pwValid, pwMatch]);

  // ── validation (same rules as before) ────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!formData.name.trim())  errs.name = "Full name is required";

    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      errs.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (!formData.email.trim()) errs.email = "Email is required";

    if (!formData.password.trim()) {
      errs.password = "Password is required";
    } else if (!pwValid) {
      errs.password = "Password does not meet requirements";
    }

    if (!formData.confirmPassword.trim()) {
      errs.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName  = nameParts.slice(1).join(" ") || ".";

    try {
      await register({
        firstName,
        lastName,
        phone:    formData.phone.trim(),
        email:    formData.email.trim(),
        password: formData.password,
      });

      toast.success(
        `✓ Account created successfully! Welcome, ${firstName}.`,
        { duration: 3500 }
      );

      navigate(PATHS.LOGIN, {
        replace: true,
        state: { registered: true, firstName },
      });
    } catch (err) {
      toast.error(
        err?.message || "Registration failed. Please try again.",
        { duration: 4000 }
      );
    }
  };

  return (
    <div
      className="w-full max-w-lg rounded-2xl p-8 shadow-xl"
      style={{
        backgroundColor: "var(--card-bg-elevated)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <div
          className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-text)",
          }}
        >
          S
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Create your account
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Join ShopApp and start shopping
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Row: Full Name */}
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          error={formErrors.name}
          autoComplete="name"
          aria-label="Full name"
        />

        {/* Row: Phone */}
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="10-digit mobile number"
          value={formData.phone}
          onChange={handleChange}
          error={formErrors.phone}
          maxLength={10}
          inputMode="numeric"
          autoComplete="tel"
          aria-label="Phone number"
        />

        {/* Row: Email */}
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          autoComplete="email"
          aria-label="Email address"
        />

        {/* Row: Password + strength */}
        <div className="space-y-2">
          <PasswordField
            label="Password"
            name="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            autoComplete="new-password"
          />
          <PasswordStrength password={formData.password} />
        </div>

        {/* Row: Confirm Password + match indicator */}
        <div className="space-y-1.5">
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            autoComplete="new-password"
          />
          {touched.confirmPassword && formData.confirmPassword.length > 0 && (
            <p
              className="flex items-center gap-1.5 text-xs"
              style={{ color: pwMatch ? "#22c55e" : "#ef4444" }}
            >
              <span className="font-bold">{pwMatch ? "✓" : "✗"}</span>
              {pwMatch ? "Passwords match" : "Passwords do not match"}
            </p>
          )}
        </div>

        {/* API-level error */}
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

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={submitDisabled}
          size="lg"
          className="mt-1"
          style={!submitDisabled ? {
            backgroundColor: "var(--button-primary)",
            color: "var(--button-primary-text)",
            borderColor: "var(--button-primary)",
          } : {}}
        >
          {loading ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: "var(--border-color)" }} />
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>or</span>
        <div className="h-px flex-1" style={{ backgroundColor: "var(--border-color)" }} />
      </div>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link
          to={PATHS.LOGIN}
          className="font-semibold hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
