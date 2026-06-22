import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '@/components/common/Button';
import Input  from '@/components/common/Input';
import useAuth from '@/features/auth/hooks/useAuth';
import { PATHS } from '@/routes/paths';

const PHONE_REGEX = /^[6-9]\d{9}$/;

function RegisterForm() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name:            '',
    phone:           '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())  errs.name = 'Full name is required';

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      errs.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!formData.email.trim()) errs.email = 'Email is required';

    if (!formData.password.trim()) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword.trim()) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    /**
     * Backend DTO (UserDto.Request) expects:
     *   firstName   — not `name`
     *   lastName    — required, not blank
     *   phoneNumber — not `phone`
     *
     * Split the full name on the first space.
     * If the user entered only one word, firstName = that word, lastName = "."
     * (backend rejects blank lastName).
     */
    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName  = nameParts.slice(1).join(' ') || '.';

    try {
      await register({
        firstName,
        lastName,
        phone:    formData.phone.trim(),   // authService maps this → phoneNumber
        email:    formData.email.trim(),
        password: formData.password,
      });

      /**
       * Registration succeeded — no auto-login in this app.
       * Navigate to Login and pass a success flag + firstName via
       * React Router location.state so LoginForm can show a banner.
       * State is never written to the URL, so it vanishes on refresh
       * (by design: the banner is a one-time confirmation).
       */
      navigate(PATHS.LOGIN, {
        replace: true,
        state: {
          registered: true,
          firstName,
        },
      });
    } catch { /* error surfaced via useAuth */ }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl p-6 shadow-lg"
      style={{
        backgroundColor: 'var(--card-bg-elevated)',
        border: '1px solid var(--border-color)',
      }}
    >
      <div>
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Create Account
        </h2>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Register to start shopping.
        </p>
      </div>

      <Input
        label="Full Name"
        name="name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
        error={formErrors.name}
      />

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
        placeholder="Create a password (min 8 characters)"
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

      {error && (
        <p
          className="rounded-lg px-3 py-2 text-sm"
          style={{
            backgroundColor: 'var(--error-bg)',
            color: 'var(--error-text)',
            border: '1px solid var(--error-border)',
          }}
        >
          {error}
        </p>
      )}

      <Button type="submit" fullWidth loading={loading}>
        Create Account
      </Button>

      <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link
          to={PATHS.LOGIN}
          className="font-medium hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
