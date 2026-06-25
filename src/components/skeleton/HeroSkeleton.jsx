import "./skeletons.css";

/**
 * Matches the BannerCarousel dimensions on Home.jsx.
 * Also includes the category-quick-link row and category-card grid below it.
 */
const HeroSkeleton = () => (
  <div aria-hidden="true">
    {/* Banner */}
    <div className="sk w-full" style={{ minHeight: 220 }} />

    {/* Fashion sub-category strip */}
    <div
      className="border-b py-5 px-4"
      style={{ background: "var(--card-bg, #fff)", borderColor: "var(--border-color)" }}
    >
      <div className="container-app">
        <div className="flex items-center justify-between mb-3">
          <div className="sk" style={{ height: 16, width: 130 }} />
          <div className="sk" style={{ height: 13, width: 60 }} />
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 rounded-lg py-3 px-2"
              style={{ background: "var(--bg-secondary, #f5f5f5)" }}
            >
              <div className="sk" style={{ height: 16, width: "60%" }} />
              <div className="sk" style={{ height: 12, width: "50%" }} />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Category cards */}
    <div
      className="border-b py-6 px-4"
      style={{ background: "var(--card-bg, #fff)", borderColor: "var(--border-color)" }}
    >
      <div className="container-app">
        <div className="sk mb-4" style={{ height: 16, width: 150 }} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="sk" style={{ height: 96, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default HeroSkeleton;
