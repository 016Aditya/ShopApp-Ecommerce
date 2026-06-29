import { useState, useCallback } from 'react';
import { useNavigate }           from 'react-router-dom';
import { useAuth }               from '@/features/auth/hooks/useAuth';
import { useProfileQuery }       from '@/hooks/useQueryProfile';
import ProfileForm               from '../components/ProfileForm';
import PasswordForm              from '../components/PasswordForm';
import { ProfileSkeleton }       from '@/components/skeleton';
import PATHS                     from '@/routes/paths';
import '../styles/ProfilePage.css';

// ── Tab configuration ────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',  label: 'Profile Info',    icon: '👤' },
  { id: 'password', label: 'Change Password', icon: '🔒' },
];

// ── Quick-nav cards (My Account grid) ────────────────────────────────────────
const NAV_CARDS = [
  {
    id: 'orders',
    label: 'My Orders',
    sub: 'Track, return or buy again',
    path: PATHS.ORDERS,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1" ry="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    sub: 'Your saved items',
    path: PATHS.WISHLIST,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    id: 'addresses',
    label: 'Saved Addresses',
    sub: 'Manage delivery locations',
    path: PATHS.SAVED_ADDRESSES,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Account Settings',
    sub: 'Update profile & password',
    path: null,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

/**
 * formatMemberSince
 * Accepts an ISO string (Instant from backend) or anything new Date() can parse.
 * Returns "June 2026" style string, or null if the value is absent / unparseable.
 */
const formatMemberSince = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  } catch {
    return null;
  }
};

// ── ProfilePage ───────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const {
    data:      profile,
    isLoading: profileLoading,
    isError:   profileError,
    refetch:   refetchProfile,
  } = useProfileQuery(user?.id);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  if (!user) { navigate('/login'); return null; }
  if (profileLoading) return <ProfileSkeleton />;

  if (profileError) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <p>⚠️ Could not load profile. Please refresh the page.</p>
          <button className="profile-btn profile-btn--primary" onClick={refetchProfile}>Retry</button>
        </div>
      </div>
    );
  }

  // ── Derive display values from UserDto.Response field names ─────────────────
  // Backend returns: { id, firstName, lastName, email, phoneNumber, role, createdAt }
  // authStore stores this object verbatim as `user`.

  const firstName   = user.firstName  ?? profile?.firstName  ?? '';
  const lastName    = user.lastName   ?? profile?.lastName   ?? '';
  const fullName    = [firstName, lastName].filter(Boolean).join(' ') || 'User';

  // Initials: first letter of firstName + first letter of lastName
  const initials = [
    firstName?.[0]?.toUpperCase(),
    lastName?.[0]?.toUpperCase(),
  ].filter(Boolean).join('') || '?';

  // phoneNumber is the field name in UserDto.Response
  const phone = user.phoneNumber ?? profile?.phoneNumber ?? null;

  // createdAt is an Instant ISO string from the backend
  const memberSince = formatMemberSince(user.createdAt ?? profile?.createdAt);

  const isAdmin = user.role === 'ADMIN';

  const handleNavCard = (card) => {
    if (card.path) {
      navigate(card.path);
    } else {
      document.getElementById('account-settings-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="profile-page">

      {/* ════════════════════════════════════════════════════════
          MY ACCOUNT — top section
      ════════════════════════════════════════════════════════ */}
      <h1 className="ma-page-title">My Account</h1>

      {/* ── Avatar / user card ── */}
      <div className="ma-user-card">
        <div className="ma-avatar">{initials}</div>

        <div className="ma-user-info">
          {/* Name row: full name + role badge */}
          <div className="ma-name-row">
            <span className="ma-name">{fullName}</span>
            <span className={`ma-role-badge${isAdmin ? ' ma-role-badge--admin' : ''}`}>
              {isAdmin ? 'ADMIN' : 'USER'}
            </span>
          </div>

          {/* Meta row: email | phone | member since */}
          <div className="ma-meta-row">
            {user.email && (
              <span className="ma-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m2 7 10 7 10-7"/>
                </svg>
                <span className="ma-meta-label">Email:</span>
                <span className="ma-meta-value">{user.email}</span>
              </span>
            )}

            {phone && (
              <span className="ma-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span className="ma-meta-label">Phone:</span>
                <span className="ma-meta-value">{phone}</span>
              </span>
            )}

            {memberSince && (
              <span className="ma-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                <span className="ma-meta-label">Member since:</span>
                <span className="ma-meta-value ma-meta-value--bold">{memberSince}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── 4-column quick-nav grid ── */}
      <div className="ma-nav-grid">
        {NAV_CARDS.map((card) => (
          <button
            key={card.id}
            className="ma-nav-card"
            onClick={() => handleNavCard(card)}
            aria-label={card.label}
          >
            <span className="ma-nav-card__icon">{card.icon}</span>
            <span className="ma-nav-card__label">{card.label}</span>
            <span className="ma-nav-card__sub">{card.sub}</span>
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          ACCOUNT SETTINGS — existing tabs (unchanged)
      ════════════════════════════════════════════════════════ */}
      <div id="account-settings-section">
        <h2 className="ma-section-title">Account Settings</h2>

        <nav className="profile-tabs" role="tablist" aria-label="Profile sections">
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`profile-tab ${activeTab === tab.id ? 'profile-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="profile-tab__icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="profile-content" role="tabpanel">
          {activeTab === 'profile' && (
            <ProfileForm
              profile={profile}
              user={user}
              onSuccess={(msg) => { refetchProfile(); showToast(msg); }}
              onError={(msg)   => showToast(msg, 'error')}
            />
          )}
          {activeTab === 'password' && (
            <PasswordForm
              user={user}
              onSuccess={(msg) => showToast(msg)}
              onError={(msg)   => showToast(msg, 'error')}
            />
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`profile-toast profile-toast--${toast.type}`} role="alert">
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
