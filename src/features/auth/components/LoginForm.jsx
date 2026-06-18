import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/common/Button";
import Input  from "@/components/common/Input";
import useAuth from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/routes/paths";

function LoginForm() {
  const { login, loading, error } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim())    errs.email    = "Email is required";
    if (!formData.password.trim()) errs.password = "Password is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try { await login(formData); } catch { /* error surfaced via useAuth */ }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl p-6 shadow-lg"
      style={{
        backgroundColor: "var(--card-bg-elevated)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div>
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Login
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Welcome back. Sign in to continue.
        </p>
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
      />

      {/* Forgot Password link */}
      <div className="flex justify-end -mt-2">
        <Link
          to={PATHS.FORGOT_PASSWORD}
          className="text-sm font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Forgot Password?
        </Link>
      </div>

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

      <Button type="submit" fullWidth loading={loading}>
        Sign In
      </Button>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Don&apos;t have an account?{" "}
        <Link
          to={PATHS.REGISTER}
          className="font-medium hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
