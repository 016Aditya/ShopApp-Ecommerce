/**
 * PageLoader
 *
 * Suspense fallback used when a lazily-loaded page chunk is downloading.
 *
 * Rules:
 * - Must NOT use min-h-screen or 100vh — that would push the Navbar and
 *   Footer out of view, making the page appear blank.
 * - Must fill only the <main> content slot (flex-1).
 * - Must use var(--bg-primary) so it matches the current theme from frame 1.
 */
const PageLoader = () => (
  <div
    className="flex-1 w-full flex items-start justify-center"
    style={{
      backgroundColor: 'var(--bg-primary)',
      minHeight: '40vh',
      paddingTop: '3rem',
    }}
    aria-busy="true"
    aria-label="Loading page…"
  >
    {/* Thin animated shimmer bar at top of content area */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background:
          'linear-gradient(90deg, var(--bg-primary) 0%, var(--accent, #ff9f00) 50%, var(--bg-primary) 100%)',
        backgroundSize: '200% 100%',
        animation: 'sk-shimmer 1.2s ease-in-out infinite',
      }}
    />
  </div>
);

export default PageLoader;
