import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";

// ─── Banner slides ────────────────────────────────────────────────────────────
const BANNERS = [
  {
    id: 1,
    tag: "MOBILES | LAPTOPS | GADGETS",
    title: "Electronics Sale",
    sub: "Up to 60% Off",
    emoji: "\ud83d\udcf1",
    bg: "from-[#0f1923] to-[#1a3352]",
    textColor: "text-white",
    subColor: "text-yellow-300",
    tagColor: "text-[#ff9900]",
    btnClass: "bg-[#ff9900] text-slate-900 hover:bg-[#e08800]",
    category: "Electronics",
  },
  {
    id: 2,
    tag: "TOP BRANDS | LATEST TRENDS",
    title: "Shop Fashion",
    sub: "Under \u20b9999",
    emoji: "\ud83d\udc57",
    bg: "from-[#dbeafe] to-[#eff6ff]",
    textColor: "text-slate-900",
    subColor: "text-slate-700",
    tagColor: "text-blue-600",
    btnClass: "bg-blue-600 text-white hover:bg-blue-700",
    category: "Clothing",
  },
  {
    id: 3,
    tag: "TEXTBOOKS | STATIONERY",
    title: "Books & More",
    sub: "Starting at \u20b999",
    emoji: "\ud83d\udcda",
    bg: "from-[#0a1f0a] to-[#1a4a1a]",
    textColor: "text-white",
    subColor: "text-green-300",
    tagColor: "text-green-400",
    btnClass: "bg-green-500 text-white hover:bg-green-600",
    category: "Books",
  },
  {
    id: 4,
    tag: "APPLIANCES | D\u00c9COR",
    title: "Home & Kitchen",
    sub: "Up to 50% Off",
    emoji: "\ud83c\udfe0",
    bg: "from-[#1f1000] to-[#4a2800]",
    textColor: "text-white",
    subColor: "text-orange-300",
    tagColor: "text-orange-400",
    btnClass: "bg-orange-500 text-white hover:bg-orange-600",
    category: "Home",
  },
];

// ─── Clothing subcategory quick-access row ────────────────────────────────────
const CLOTHING_SUBS = [
  { label: "Shirt",  emoji: "\ud83d\udc55" },
  { label: "Jeans",  emoji: "\ud83d\udc56" },
  { label: "Dress",  emoji: "\ud83d\udc57" },
  { label: "Shoes",  emoji: "\ud83d\udc9f" },
  { label: "Jacket", emoji: "\ud83e\udde5" },
  { label: "Kurta",  emoji: "\ud83e\udde3" },
];

// ─── Category quick-links ─────────────────────────────────────────────────────
const CATEGORY_CARDS = [
  { label: "Electronics", emoji: "\ud83d\udcbb", bg: "from-[#0f1923] to-[#1a3352]", text: "text-white" },
  { label: "Clothing",    emoji: "\ud83d\udc57", bg: "from-[#dbeafe] to-[#eff6ff]",  text: "text-slate-900" },
  { label: "Books",       emoji: "\ud83d\udcda", bg: "from-[#0a1f0a] to-[#1a4a1a]",  text: "text-white" },
  { label: "Home",        emoji: "\ud83c\udfe0", bg: "from-[#1f1000] to-[#4a2800]",  text: "text-white" },
  { label: "Sports",      emoji: "\u26bd",      bg: "from-[#1a0f2e] to-[#2d1f5c]",  text: "text-white" },
];

function Home() {
  return (
    <div className="min-h-screen bg-[#f1f3f6]">

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <BannerCarousel />

      {/* ── Clothing subcategory strip ──────────────────────────────────── */}
      <section className="bg-white py-5 border-b shadow-sm">
        <div className="container-app">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Shop by Fashion</h2>
            {/* Use Link with `to` object so ?category= lands in useSearchParams */}
            <Link
              to={{ pathname: PATHS.PRODUCTS, search: "?category=Clothing" }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {CLOTHING_SUBS.map((s) => (
              <Link
                key={s.label}
                to={{
                  pathname: PATHS.PRODUCTS,
                  search: `?category=Clothing&subcategory=${s.label}`,
                }}
                className="flex flex-col items-center gap-1.5 rounded-lg bg-slate-50 py-3 px-2 text-center transition hover:bg-blue-50 hover:shadow"
              >
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-xs font-semibold text-slate-700">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Quick Links ────────────────────────────────────────── */}
      <section className="bg-white py-6 border-b">
        <div className="container-app">
          <h2 className="mb-4 text-base font-bold text-slate-800">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {CATEGORY_CARDS.map((c) => (
              <Link
                key={c.label}
                to={{ pathname: PATHS.PRODUCTS, search: `?category=${c.label}` }}
                className={`group relative flex h-24 items-end overflow-hidden rounded-lg bg-gradient-to-br ${c.bg} p-3 transition hover:shadow-lg`}
              >
                <span className="absolute right-2 top-2 text-4xl opacity-70 group-hover:scale-110 transition-transform">
                  {c.emoji}
                </span>
                <span className={`text-sm font-bold ${c.text}`}>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── Banner Carousel ──────────────────────────────────────────────────────────
function BannerCarousel() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % BANNERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const b = BANNERS[active];

  // KEY FIX: object form so React Router sets searchParams correctly
  const goTo = () =>
    navigate({
      pathname: PATHS.PRODUCTS,
      search: `?category=${b.category}`,
    });

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r ${b.bg} cursor-pointer transition-all duration-700`}
      onClick={goTo}
      role="link"
      aria-label={`Go to ${b.title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && goTo()}
    >
      <div className="container-app flex items-center justify-between py-14 md:py-20">
        <div className="max-w-md space-y-3">
          <p className={`text-xs font-bold uppercase tracking-widest ${b.tagColor}`}>
            {b.tag}
          </p>
          <h1 className={`text-4xl font-extrabold md:text-5xl ${b.textColor}`}>
            {b.title}
          </h1>
          <p className={`text-xl font-semibold ${b.subColor}`}>{b.sub}</p>
          <button
            onClick={(e) => { e.stopPropagation(); goTo(); }}
            className={`mt-2 inline-block rounded-sm px-7 py-2.5 text-sm font-bold shadow transition ${b.btnClass}`}
          >
            Shop Now
          </button>
        </div>
        <span className="hidden text-[120px] md:block select-none">{b.emoji}</span>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setActive(i); }}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-current opacity-90" : "w-2 bg-current opacity-30 hover:opacity-60"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + BANNERS.length) % BANNERS.length); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition text-lg leading-none"
        aria-label="Previous"
      >
        &#8249;
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % BANNERS.length); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition text-lg leading-none"
        aria-label="Next"
      >
        &#8250;
      </button>
    </div>
  );
}

export default Home;
