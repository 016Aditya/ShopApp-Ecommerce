/**
 * PageLoader — centered spinner used during React.lazy() Suspense boundaries.
 *
 * Fix: replaced `min-h-screen` with `flex-1` so it fills only the <main>
 * content area provided by PageWrapper, never the full viewport. Using
 * `min-h-screen` caused it to push Navbar/Footer off screen on Suspense
 * boundaries, effectively creating a full-page white/themed takeover.
 */
const PageLoader = () => (
  <div
    className="flex flex-1 items-center justify-center py-24"
    style={{ backgroundColor: "var(--bg-primary)" }}
    role="status"
    aria-label="Loading page…"
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      style={{ color: "var(--accent, #ff9f00)" }}
    >
      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" />
      <path
        d="M20 4a16 16 0 0 1 16 16"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 20 20"
          to="360 20 20"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  </div>
);

export default PageLoader;
