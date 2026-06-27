import { useState } from 'react';
import { useAuth }  from '@/features/auth/hooks/useAuth';
import { changePassword } from '@/services/profileService';

/**
 * PasswordForm
 *
 * Handles the “Change Password” tab on ProfilePage.
 * Validates locally (new ≠ current, length, match), then calls
 * changePassword(userId, { currentPassword, newPassword }).
 *
 * Props
 *   user           — auth user from ProfilePage (passed down to avoid a second hook call)
 *   onSuccess(msg) — show success toast in ProfilePage
 *   onError(msg)   — show error toast in ProfilePage
 */
const PasswordForm = ({ user, onSuccess, onError }) => {
  const { user: authUser } = useAuth();

  const [form, setForm] = useState({
    currentPassword : '',
    newPassword     : '',
    confirmPassword : '',
  });
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState({});
  const [show,    setShow]    = useState({ current: false, new: false, confirm: false });

  // ── Field config ───────────────────────────────────────────────────────────────
  const FIELDS = [
    { name: 'currentPassword', label: 'Current Password', showKey: 'current' },
    { name: 'newPassword',     label: 'New Password',     showKey: 'new'     },
    { name: 'confirmPassword', label: 'Confirm Password', showKey: 'confirm' },
  ];

  // ── Validation ─────────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.currentPassword)
      errs.currentPassword = 'Current password is required.';
    if (form.newPassword.length < 6)
      errs.newPassword = 'New password must be at least 6 characters.';
    if (form.newPassword === form.currentPassword)
      errs.newPassword = 'New password must differ from current password.';
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const toggleShow = (key) =>
    setShow(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const uid = authUser?.id ?? user?.id;
    if (!uid) return;

    setSaving(true);
    try {
      await changePassword(uid, {
        currentPassword : form.currentPassword,
        newPassword     : form.newPassword,
      });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      onSuccess('Password changed successfully!');
    } catch (err) {
      onError(err.response?.data?.message ?? 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="password-form" noValidate>
      <fieldset className="profile-fieldset">
        <legend className="profile-fieldset__legend">🔒 Change Password</legend>

        {FIELDS.map(({ name, label, showKey }) => (
          <div key={name} className="profile-field">
            <label htmlFor={name} className="profile-field__label">{label}</label>
            <div className="password-field-wrapper">
              <input
                id={name}
                name={name}
                type={show[showKey] ? 'text' : 'password'}
                value={form[name]}
                onChange={handleChange}
                className={`profile-field__input${errors[name] ? ' profile-field__input--error' : ''}`}
                autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => toggleShow(showKey)}
                aria-label={show[showKey] ? 'Hide password' : 'Show password'}
              >
                {show[showKey] ? '🙈' : '👁️'}
              </button>
            </div>
            {errors[name] && (
              <p className="profile-field__error" role="alert">{errors[name]}</p>
            )}
          </div>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={saving}
        className="profile-btn profile-btn--primary"
      >
        {saving ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
};

export default PasswordForm;
