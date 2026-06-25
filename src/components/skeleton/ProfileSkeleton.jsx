import "./skeletons.css";

/**
 * Mirrors ProfilePage layout:
 *   - Page title
 *   - Profile header card (avatar + name + meta row)
 *   - 4 quick-link cards (2×2 grid on mobile, 4-col on sm)
 *   - Settings section (profile form + password form)
 */
const ProfileSkeleton = () => (
  <div
    className="min-h-screen"
    style={{ backgroundColor: "var(--bg-primary)" }}
    aria-hidden="true"
  >
    <div className="container-app py-8">
      {/* Page title */}
      <div className="sk mb-6" style={{ height: 24, width: 140 }} />

      {/* Profile header card */}
      <div
        className="mb-6 rounded-xl p-6"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* Avatar */}
          <div className="sk flex-shrink-0" style={{ width: 80, height: 80, borderRadius: "50%" }} />
          <div className="flex-1">
            {/* Name + badge */}
            <div className="flex gap-2 items-center mb-3">
              <div className="sk" style={{ height: 22, width: 160 }} />
              <div className="sk" style={{ height: 18, width: 50, borderRadius: 999 }} />
            </div>
            {/* Meta row */}
            <div className="flex flex-wrap gap-5">
              <div className="sk" style={{ height: 14, width: 180 }} />
              <div className="sk" style={{ height: 14, width: 110 }} />
              <div className="sk" style={{ height: 14, width: 130 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick-link cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="sk mb-3" style={{ width: 40, height: 40, borderRadius: 8 }} />
            <div className="sk mb-1" style={{ height: 14, width: "70%" }} />
            <div className="sk" style={{ height: 11, width: "90%" }} />
          </div>
        ))}
      </div>

      {/* Settings section placeholder */}
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="sk mb-5" style={{ height: 18, width: 120 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-4">
            <div className="sk mb-1" style={{ height: 12, width: 80 }} />
            <div className="sk" style={{ height: 40, borderRadius: 4 }} />
          </div>
        ))}
        <div className="sk mt-2" style={{ height: 40, width: 120, borderRadius: 4 }} />
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;
