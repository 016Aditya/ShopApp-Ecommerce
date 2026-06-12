import ProfileForm from "../components/ProfileForm";
import PasswordForm from "../components/PasswordForm";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="page profile-page">
      <h1 className="page__title">My Profile</h1>
      <div className="profile-page__layout">
        <aside className="profile-page__sidebar">
          <div className="profile-badge">
            <div className="profile-badge__avatar" aria-hidden="true">
              {user?.firstName?.[0]?.toUpperCase() ?? "U"}
            </div>
            <p className="profile-badge__name">{user?.firstName} {user?.lastName}</p>
            <p className="profile-badge__email">{user?.email}</p>
            <span className="profile-badge__role">{user?.role ?? "USER"}</span>
          </div>
        </aside>
        <div className="profile-page__forms">
          <ProfileForm />
          <hr className="divider" />
          <PasswordForm />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
