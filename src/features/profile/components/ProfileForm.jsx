import { useState, useEffect } from 'react';
import { useAuth }             from '@/features/auth/hooks/useAuth';
import { updateProfile }       from '@/services/profileService';

/**
 * ProfileForm
 *
 * Renders and submits the user’s editable profile fields:
 *   name, phone, address (street / city / state / zip / country).
 *
 * Props
 *   profile  — server-side profile object (may be null while loading)
 *   user     — auth user object from useAuthStore (for fallback display)
 *   onSuccess(msg) — callback: show toast + trigger refetch in ProfilePage
 *   onError(msg)   — callback: show error toast in ProfilePage
 */
const ProfileForm = ({ profile, user, onSuccess, onError }) => {
  const { user: authUser } = useAuth();

  // ── Form state ─────────────────────────────────────────────────────────────
  const [form,    setForm]    = useState({ name: '', phone: '', street: '', city: '', state: '', zip: '', country: '' });
  const [saving,  setSaving]  = useState(false);
  const [touched, setTouched] = useState({});

  // ── Pre-fill ──────────────────────────────────────────────────────────────────
  // Pre-fill from profile (API) first; fall back to AuthContext user
  useEffect(() => {
    setForm({
      name    : profile?.name    ?? authUser?.name  ?? '',
      phone   : profile?.phone   ?? '',
      street  : profile?.address?.street  ?? '',
      city    : profile?.address?.city    ?? '',
      state   : profile?.address?.state   ?? '',
      zip     : profile?.address?.zip     ?? '',
      country : profile?.address?.country ?? '',
    });
  }, [profile, authUser]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authUser?.id) return;
    setSaving(true);
    try {
      await updateProfile(authUser.id, {
        name  : form.name.trim(),
        phone : form.phone.trim(),
        address: {
          street  : form.street.trim(),
          city    : form.city.trim(),
          state   : form.state.trim(),
          zip     : form.zip.trim(),
          country : form.country.trim(),
        },
      });
      onSuccess('Profile updated successfully!');
    } catch (err) {
      onError(err.response?.data?.message ?? 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const isDirty = Object.values(touched).some(Boolean);

  // ── Field config ───────────────────────────────────────────────────────────────
  const BASIC_FIELDS = [
    { name: 'name',  label: 'Full Name',    type: 'text',  placeholder: 'John Doe' },
    { name: 'phone', label: 'Phone Number', type: 'tel',   placeholder: '+91 98765 43210' },
  ];
  const ADDRESS_FIELDS = [
    { name: 'street',  label: 'Street Address', type: 'text', placeholder: '123 Main Street', colSpan: true },
    { name: 'city',    label: 'City',           type: 'text', placeholder: 'Mumbai' },
    { name: 'state',   label: 'State',          type: 'text', placeholder: 'Maharashtra' },
    { name: 'zip',     label: 'ZIP Code',       type: 'text', placeholder: '400001' },
    { name: 'country', label: 'Country',        type: 'text', placeholder: 'India' },
  ];

  const renderField = ({ name, label, type, placeholder, colSpan }) => (
    <div key={name} className={`profile-field${colSpan ? ' profile-field--full' : ''}`}>
      <label htmlFor={name} className="profile-field__label">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        placeholder={placeholder}
        onChange={handleChange}
        className="profile-field__input"
      />
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="profile-form" noValidate>

      {/* Basic info */}
      <fieldset className="profile-fieldset">
        <legend className="profile-fieldset__legend">👤 Personal Information</legend>
        <div className="profile-grid">
          {BASIC_FIELDS.map(renderField)}
        </div>
      </fieldset>

      {/* Address */}
      <fieldset className="profile-fieldset">
        <legend className="profile-fieldset__legend">🏠 Address</legend>
        <div className="profile-grid">
          {ADDRESS_FIELDS.map(renderField)}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={saving || !isDirty}
        className="profile-btn profile-btn--primary"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>

    </form>
  );
};

export default ProfileForm;
