import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
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

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim())    errors.email    = "Email is required";
    if (!formData.password.trim()) errors.password = "Password is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try { await login(formData); } catch (err) { console.error(err); }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl p-8 shadow-lg"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Login</h2>
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

      {error && <p className="text-sm" style={{ color: "var(--error-text)" }}>{error}</p>}

      <Button type="submit" fullWidth loading={loading}>
        Sign In
      </Button>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Don&apos;t have an account?{" "}
        <Link to={PATHS.REGISTER} className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
