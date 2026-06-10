import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PATHS from "@/routes/paths";

const SLIDES = [
  {
    id: 1,
    title: "Shop Fashion",
    subtitle: "Under ₹999",
    tag: "TOP BRANDS | LATEST TRENDS",
    bg: "from-blue-50 to-indigo-100",
    accent: "#2874f0",
    emoji: "👗",
    cta: "Shop Now",
    link: `${PATHS.PRODUCTS}?category=Clothing`,
  },
  {
    id: 2,
    title: "Electronics Sale",
    subtitle: "Up to 60% Off",
    tag: "MOBILES | LAPTOPS | GADGETS",
    bg: "from-slate-800 to-slate-900",
    accent: "#ff9f00",
    emoji: "📱",
    cta: "Explore Now",
    link: `${PATHS.PRODUCTS}?category=Electronics`,
    dark: true,
  },
  {
    id: 3,
    title: "Books & More",
    subtitle: "Starting ₹99",
    tag: "BESTSELLERS | NEW ARRIVALS",
    bg: "from-orange-50 to-amber-100",
    accent: "#e07d00",
    emoji: "📚",
    cta: "Browse All",
    link: `${PATHS.PRODUCTS}?category=Books`,
  },
  {
    id: 4,
    title: "Home & Living",
    subtitle: "Revamp in Style",
    tag: "FURNITURE | DECOR | KITCHEN",
    bg: "from-green-50 to-emerald-100",
    accent: "#26a541",
    emoji: "🏠",
    cta: "Shop Home",
    link: `${PATHS.PRODUCTS}?category=Home`,
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative overflow-hidden">
      <div className={`bg-gradient-to-r ${slide.bg} transition-all duration-700`}>
        <div className="container-app flex items-center justify-between py-10 md:py-14">
          {/* Left */}
          <div className="flex flex-col gap-3 max-w-md">
            <span className={`text-xs font-bold tracking-widest`} style={{ color: slide.accent }}>
              {slide.tag}
            </span>
            <h1 className={`text-4xl md:text-5xl font-extrabold ${slide.dark ? "text-white" : "text-slate-900"}`}>
              {slide.title}
            </h1>
            <p className={`text-2xl font-bold ${slide.dark ? "text-yellow-400" : "text-slate-700"}`}>
              {slide.subtitle}
            </p>
            <Link
              to={slide.link}
              className="mt-3 w-fit rounded-sm px-8 py-2.5 text-sm font-bold text-white shadow transition hover:opacity-90"
              style={{ backgroundColor: slide.accent }}
            >
              {slide.cta}
            </Link>
          </div>
          {/* Right */}
          <div className="text-[120px] md:text-[160px] select-none hidden sm:block">
            {slide.emoji}
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white transition"
        aria-label="Previous"
      >
        <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white transition"
        aria-label="Next"
      >
        <svg className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-6 bg-[#2874f0]" : "w-2 bg-slate-300"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroBanner;
