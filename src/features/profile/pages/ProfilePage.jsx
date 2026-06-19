import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import PasswordForm from "../components/PasswordForm";
import { useAuth } from "@/context/AuthContext";
import PATHS from "@/routes/paths";

/* ── Account quick-link cards (below header) ───────────────────────────────── */
const ACCOUNT_CARDS = [
  {
    id: "orders",
    label: "My Orders",
    description: "Track, return or buy again",
    path: PATHS.ORDERS,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      </svg>
    ),
  },
  {
    id: "wishlist",
    label: "Wishlist",
    description: "Your saved items",
    path: PATHS.WISHLIST,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
  },
  {
    id: "addresses",
    label: "Saved Addresses",
    description: "Manage delivery locations",
    path: PATHS.CHECKOUT,
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Account Settings",
    description: "Update profile & password",
    path: "#settings",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    isAnchor: true,
  },
];

/* ── Avatar initials ─────────────────────────────────────────────────────────────────────── */
function AvatarInitials({ firstName, lastName }) {
  const initials = [
    firstName?.[0]?.toUpperCase() ?? "",
    lastName?.[0]?.toUpperCase() ?? "",
  ]
    .join("")
    .trim() || "U";

  return (
    <div
      className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full text-2xl font-extrabold"
      style={{
        background: "linear-gradient(135deg, #ff9f00 0%, #e08e00 100%)",
        color: "#0f0f11",
        boxShadow: "0 4px 16px rgba(255,159,0,0.35)",
        letterSpacing: "0.02em",
      }}
      aria-label={`Avatar for ${firstName} ${lastName}`}
    >
      {initials}
    </div>
  );
}

/* ── Meta item (icon + label) ─────────────────────────────────────────────────────── */
function MetaItem({ icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "var(--text-tertiary)" }} aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {label}:
      </span>
      <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────────────────────────── */
const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="container-app py-8">

        {/* ── Page title ────────────────────────────────────────────── */}
        <h1
          className="mb-6 text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          My Account
        </h1>

        {/* ── Profile header card ───────────────────────────────────────── */}
        <div
          className="mb-6 rounded-xl p-6"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <AvatarInitials
              firstName={user?.firstName}
              lastName={user?.lastName}
            />

            <div className="flex-1 min-w-0">
              {/* Name + role badge */}
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h2
                  className="text-xl font-bold leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user?.firstName} {user?.lastName}
                </h2>
                {user?.role && (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      backgroundColor: "var(--accent-subtle)",
                      color: "var(--accent)",
                      border: "1px solid var(--accent-border)",
                    }}
                  >
                    {user.role}
                  </span>
                )}
              </div>

              {/* Meta row */}
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                <MetaItem
                  icon={
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  }
                  label="Email"
                  value={user?.email}
                />
                {user?.phoneNumber && (
                  <MetaItem
                    icon={
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                    }
                    label="Phone"
                    value={user.phoneNumber}
                  />
                )}
                {memberSince && (
                  <MetaItem
                    icon={
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                      </svg>
                    }
                    label="Member since"
                    value={memberSince}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Account quick-link cards ───────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACCOUNT_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              className="group flex flex-col items-start gap-3 rounded-xl p-4 text-left transition-all duration-150"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
              onClick={() => {
                if (card.isAnchor) {
                  document
                    .getElementById("settings-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate(card.path);
                }
              }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-150"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--accent)",
                }}
                aria-hidden="true"
              >
                {card.icon}
              </span>
              <div>
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {card.label}
                </p>
                <p
                  className="mt-0.5 text-xs leading-snug"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {card.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Settings section (forms) ────────────────────────────────────── */}
        <div id="settings-section" className="space-y-5">
          <h2
            className="text-base font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Account Settings
          </h2>

          {/* Profile form card */}
          <div
            className="rounded-xl p-5 sm:p-6"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3
              className="mb-4 text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Personal Information
            </h3>
            <ProfileForm />
          </div>

          {/* Password form card */}
          <div
            className="rounded-xl p-5 sm:p-6"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <h3
              className="mb-4 text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Change Password
            </h3>
            <PasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
