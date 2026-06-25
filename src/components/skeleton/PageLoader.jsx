/**
 * PageLoader — full-page centered spinner used during React.lazy() Suspense
 * boundaries. Lightweight; does not rely on any CSS skeleton classes.
 */
const PageLoader = () => (
  <div
    className="flex min-h-screen items-center justify-center"
    style={{ background: "var(--bg-primary)" }}
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
