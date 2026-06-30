import { useState, useEffect } from 'react';
import { userService }        from '@/services/userService';
import { useAuth }            from '@/features/auth/hooks/useAuth';
import { useQueryClient }     from '@tanstack/react-query';
import { queryKeys }          from '@/lib/queryKeys';   // ✅ correct named export

// ── helpers ──────────────────────────────────────────────────────────────────
const empty = (v) => !v || String(v).trim() === '';

const buildInitial = (profile, user) => ({
  firstName:    profile?.firstName    ?? user?.firstName    ?? '',
  lastName:     profile?.lastName     ?? user?.lastName     ?? '',
  phoneNumber:  profile?.phoneNumber  ?? user?.phoneNumber  ?? '',
  // address sub-fields — pre-filled from profile.address when available
  addrFullName: profile?.address?.fullName      ?? '',
  addrPhone:    profile?.address?.phoneNumber   ?? '',
  addrLine1:    profile?.address?.addressLine1  ?? '',
  addrLine2:    profile?.address?.addressLine2  ?? '',
  city:         profile?.address?.city          ?? '',
  state:        profile?.address?.state         ?? '',
  zipCode:      profile?.address?.zipCode       ?? '',
  country:      profile?.address?.country       ?? 'India',
});

// ── ProfileForm ───────────────────────────────────────────────────────────────
const ProfileForm = ({ profile, user, onSuccess, onError }) => {
  const { updateUser }   = useAuth();
  const queryClient      = useQueryClient();
  const [fields, setFields]   = useState(() => buildInitial(profile, user));
  const [loading, setLoading] = useState(false);

  // Re-seed when profile data arrives (first query load)
  useEffect(() => {
    setFields(buildInitial(profile, user));
  }, [profile, user]);

  const set = (key) => (e) => setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (empty(fields.firstName)) { onError('First name is required.'); return; }
    if (empty(fields.lastName))  { onError('Last name is required.');  return; }

    setLoading(true);
    try {
      // Build the request body that matches UserDto.UpdateProfileRequest
      const payload = {
        firstName:   fields.firstName.trim(),
        lastName:    fields.lastName.trim(),
        phoneNumber: fields.phoneNumber.trim() || undefined,
        // Only include the address block when at least one field is filled
        ...(!empty(fields.addrLine1) && {
          address: {
            fullName:     fields.addrFullName.trim() || undefined,
            phoneNumber:  fields.addrPhone.trim()    || undefined,
            addressLine1: fields.addrLine1.trim(),
            addressLine2: fields.addrLine2.trim()    || undefined,
            city:         fields.city.trim()         || undefined,
            state:        fields.state.trim()        || undefined,
            zipCode:      fields.zipCode.trim()      || undefined,
            country:      fields.country.trim()      || undefined,
          },
        }),
      };

      const updatedUser = await userService.updateProfile(user.id, payload);

      // Sync Zustand auth store so the Navbar name updates immediately
      updateUser?.(updatedUser);

      // Invalidate the profile TanStack query so ProfilePage re-fetches
      // ✅ queryKeys.profile.me(id) — correct factory shape
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me(user.id) });

      onSuccess('Profile updated successfully.');
    } catch (err) {
      onError(err?.message ?? 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate>

      {/* ── Personal info ── */}
      <fieldset className="pf-fieldset">
        <legend className="pf-legend">Personal Information</legend>

        <div className="pf-row pf-row--2col">
          <div className="pf-group">
            <label htmlFor="pf-firstName" className="pf-label">First Name *</label>
            <input
              id="pf-firstName"
              className="pf-input"
              type="text"
              value={fields.firstName}
              onChange={set('firstName')}
              placeholder="Aditya"
              required
            />
          </div>

          <div className="pf-group">
            <label htmlFor="pf-lastName" className="pf-label">Last Name *</label>
            <input
              id="pf-lastName"
              className="pf-input"
              type="text"
              value={fields.lastName}
              onChange={set('lastName')}
              placeholder="Kumar"
              required
            />
          </div>
        </div>

        <div className="pf-group">
          <label htmlFor="pf-phoneNumber" className="pf-label">Mobile Number</label>
          <input
            id="pf-phoneNumber"
            className="pf-input"
            type="tel"
            value={fields.phoneNumber}
            onChange={set('phoneNumber')}
            placeholder="9876543210"
            maxLength={10}
          />
        </div>
      </fieldset>

      {/* ── Delivery address ── */}
      <fieldset className="pf-fieldset">
        <legend className="pf-legend">Default Delivery Address</legend>

        <div className="pf-row pf-row--2col">
          <div className="pf-group">
            <label htmlFor="pf-addrFullName" className="pf-label">Full Name</label>
            <input
              id="pf-addrFullName"
              className="pf-input"
              type="text"
              value={fields.addrFullName}
              onChange={set('addrFullName')}
              placeholder="Aditya Kumar"
            />
          </div>

          <div className="pf-group">
            <label htmlFor="pf-addrPhone" className="pf-label">Phone</label>
            <input
              id="pf-addrPhone"
              className="pf-input"
              type="tel"
              value={fields.addrPhone}
              onChange={set('addrPhone')}
              placeholder="9876543210"
              maxLength={10}
            />
          </div>
        </div>

        <div className="pf-group">
          <label htmlFor="pf-addrLine1" className="pf-label">Address Line 1</label>
          <input
            id="pf-addrLine1"
            className="pf-input"
            type="text"
            value={fields.addrLine1}
            onChange={set('addrLine1')}
            placeholder="House / Flat no., Street, Area"
          />
        </div>

        <div className="pf-group">
          <label htmlFor="pf-addrLine2" className="pf-label">Address Line 2 <span className="pf-optional">(optional)</span></label>
          <input
            id="pf-addrLine2"
            className="pf-input"
            type="text"
            value={fields.addrLine2}
            onChange={set('addrLine2')}
            placeholder="Landmark, Near..."
          />
        </div>

        <div className="pf-row pf-row--3col">
          <div className="pf-group">
            <label htmlFor="pf-city" className="pf-label">City</label>
            <input id="pf-city" className="pf-input" type="text" value={fields.city} onChange={set('city')} placeholder="Kolkata" />
          </div>
          <div className="pf-group">
            <label htmlFor="pf-state" className="pf-label">State</label>
            <input id="pf-state" className="pf-input" type="text" value={fields.state} onChange={set('state')} placeholder="West Bengal" />
          </div>
          <div className="pf-group">
            <label htmlFor="pf-zipCode" className="pf-label">PIN Code</label>
            <input id="pf-zipCode" className="pf-input" type="text" value={fields.zipCode} onChange={set('zipCode')} placeholder="700001" maxLength={6} />
          </div>
        </div>

        <div className="pf-group">
          <label htmlFor="pf-country" className="pf-label">Country</label>
          <input id="pf-country" className="pf-input" type="text" value={fields.country} onChange={set('country')} placeholder="India" />
        </div>
      </fieldset>

      <button
        type="submit"
        className="profile-btn profile-btn--primary"
        disabled={loading}
      >
        {loading ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
};

export default ProfileForm;
