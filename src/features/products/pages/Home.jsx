import { Link } from "react-router-dom";
import PATHS from "@/routes/paths";

// Banner slides: label, subtitle, discount, emoji, category query
const BANNERS = [
  {
    id: 1,
    tag: "MOBILES | LAPTOPS | GADGETS",
    title: "Electronics Sale",
    sub: "Up to 60% Off",
    emoji: "📱",
    bg: "from-[#0f1923] to-[#1a3352]",
    category: "Electronics",
  },
  {
    id: 2,
    tag: "SHIRTS | JEANS | DRESSES",
    title: "Fashion Fiesta",
    sub: "Min 40% Off on Top Brands",
    emoji: "👗",
    bg: "from-[#1a0a2e] to-[#3b1f5e]",
    category: "Clothing",
  },
  {
    id: 3,
    tag: "TEXTBOOKS | STATIONERY",
    title: "Books & More",
    sub: "Starting at ₹99",
    emoji: "📚",
    bg: "from-[#0a1f0a] to-[#1a4a1a]",
    category: "Books",
  },
  {
    id: 4,
    tag: "APPLIANCES | DÉCOR",
    title: "Home & Kitchen",
    sub: "Up to 50% Off",
    emoji: "🏠",
    bg: "from-[#1f1000] to-[#4a2800]",
    category: "Home",
  },
];

function Home() {
  return (
    <div>
      {/* ── Hero Banner Carousel (CSS-only) ─────────────────────────────── */}
      <BannerCarousel />

      {/* ── Category Quick Links ─────────────────────────────────────────── */}
      <section className="bg-white py-6 border-b">
        <div className="container-app">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BANNERS.map((b) => (
              <Link
                key={b.id}
                to={`${PATHS.PRODUCTS}?category=${b.category}`}
                className={`group relative flex h-28 items-end overflow-hidden rounded-lg bg-gradient-to-br ${b.bg} p-4 transition hover:shadow-lg`}
              >
                <span className="absolute right-3 top-3 text-4xl opacity-70 group-hover:scale-110 transition-transform">
                  {b.emoji}
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
                    {b.tag}
                  </p>
                  <p className="text-sm font-bold text-white">{b.title}</p>
                  <p className="text-xs text-slate-300">{b.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Simple 4-slide auto-rotating banner ───────────────────────────────────
import { useState, useEffect } from "react";

function BannerCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = BANNERS[active];

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${b.bg} transition-all duration-700`}>
      <div className="container-app flex items-center justify-between py-14 md:py-20">
        <div className="max-w-md space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#ff9900]">
            {b.tag}
          </p>
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">{b.title}</h1>
          <p className="text-xl font-semibold text-yellow-300">{b.sub}</p>
          <Link
            to={`${PATHS.PRODUCTS}?category=${b.category}`}
            className="mt-2 inline-block rounded-sm bg-[#ff9900] px-7 py-2.5 text-sm font-bold text-slate-900 shadow hover:bg-[#e08800] transition"
          >
            Explore Now
          </Link>
        </div>
        <span className="hidden text-[120px] md:block select-none">{b.emoji}</span>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-[#ff9900]" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setActive((a) => (a - 1 + BANNERS.length) % BANNERS.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition"
        aria-label="Previous"
      >
        &#8249;
      </button>
      <button
        onClick={() => setActive((a) => (a + 1) % BANNERS.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition"
        aria-label="Next"
      >
        &#8250;
      </button>
    </div>
  );
}

export default Home;
