import { useState, useCallback } from 'react';
import { useNavigate }           from 'react-router-dom';
import { useAuth }               from '@/features/auth/hooks/useAuth';
import { useProfileQuery }       from '@/hooks/useQueryProfile';
import ProfileForm               from '../components/ProfileForm';
import PasswordForm              from '../components/PasswordForm';
import { ProfileSkeleton }       from '@/components/skeleton';
import '../styles/ProfilePage.css';

// ── Tab configuration ───────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',  label: 'Profile Info',    icon: '👤' },
  { id: 'password', label: 'Change Password', icon: '🔒' },
];

// ── ProfilePage ───────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // ── Server state via TanStack Query ─────────────────────────────────────
  // FIX: was `useQueryProfile` (does not exist) — the correct export is `useProfileQuery`
  const {
    data:    profile,
    isLoading: profileLoading,
    isError:   profileError,
    refetch:   refetchProfile,
  } = useProfileQuery(user?.id);

  // ── Toast / feedback state ─────────────────────────────────────────────
  const [toast, setToast] = useState(null);   // { msg, type: 'success'|'error' }

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Guard: redirect guests to login ──────────────────────────────────────
  if (!user) {
    navigate('/login');
    return null;
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (profileLoading) return <ProfileSkeleton />;

  // ── Error state ─────────────────────────────────────────────────────────────
  if (profileError) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <p>⚠️ Could not load profile. Please refresh the page.</p>
          <button className="profile-btn profile-btn--primary" onClick={refetchProfile}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────────
  return (
    <div className="profile-page">

      {/* ── Header ── */}
      <div className="profile-header">
        <div className="profile-header__avatar">
          {user.name?.[0]?.toUpperCase() ?? '👤'}
        </div>
        <div className="profile-header__info">
          <h1 className="profile-header__name">{user.name ?? 'My Account'}</h1>
          <p className="profile-header__email">{user.email}</p>
          {user.role === 'ADMIN' && (
            <span className="profile-header__badge">🛡️ Admin</span>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <nav className="profile-tabs" role="tablist" aria-label="Profile sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`profile-tab ${
              activeTab === tab.id ? 'profile-tab--active' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="profile-tab__icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Tab panels ── */}
      <div className="profile-content" role="tabpanel">
        {activeTab === 'profile' && (
          <ProfileForm
            profile={profile}
            user={user}
            onSuccess={(msg) => { refetchProfile(); showToast(msg); }}
            onError={(msg)    => showToast(msg, 'error')}
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

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`profile-toast profile-toast--${toast.type}`}
          role="alert"
        >
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
