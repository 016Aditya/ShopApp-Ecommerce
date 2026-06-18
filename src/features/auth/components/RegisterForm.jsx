import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import useAuth from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/routes/paths";

function RegisterForm() {
  const { register, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim())  errors.lastName  = "Last name is required";
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      errors.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.email.trim())    errors.email    = "Email is required";
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await register({
        firstName: formData.firstName,
        lastName:  formData.lastName,
        phone:     formData.phone,
        email:     formData.email,
        password:  formData.password,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl p-8 shadow-lg"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Create Account</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Register to start shopping.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First Name"
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          error={formErrors.firstName}
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          error={formErrors.lastName}
        />
      </div>

      {/* Phone — between Full Name and Email, for password recovery only */}
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="10-digit mobile number"
        value={formData.phone}
        onChange={handleChange}
        error={formErrors.phone}
        hint="Used only for password recovery verification"
      />

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
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        error={formErrors.password}
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={formErrors.confirmPassword}
      />

      {error && <p className="text-sm" style={{ color: "var(--error-text)" }}>{error}</p>}

      <Button type="submit" fullWidth loading={loading}>
        Create Account
      </Button>

      <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link to={PATHS.LOGIN} className="font-medium hover:underline" style={{ color: "var(--accent)" }}>
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
