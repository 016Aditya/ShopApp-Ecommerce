import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PATHS from "@/routes/paths";

const BANNERS = [
  {
    id: 1,
    tag: "MOBILES | LAPTOPS | GADGETS",
    title: "Electronics Sale",
    sub: "Up to 60% Off",
    emoji: "Phone",
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
    sub: "Under Rs.999",
    emoji: "Fashion",
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
    sub: "Starting at Rs.99",
    emoji: "Books",
    bg: "from-[#0a1f0a] to-[#1a4a1a]",
    textColor: "text-white",
    subColor: "text-green-300",
    tagColor: "text-green-400",
    btnClass: "bg-green-500 text-white hover:bg-green-600",
    category: "Books",
  },
  {
    id: 4,
    tag: "APPLIANCES | DECOR",
    title: "Home & Kitchen",
    sub: "Up to 50% Off",
    emoji: "Home",
    bg: "from-[#1f1000] to-[#4a2800]",
    textColor: "text-white",
    subColor: "text-orange-300",
    tagColor: "text-orange-400",
    btnClass: "bg-orange-500 text-white hover:bg-orange-600",
    category: "Home",
  },
];

const CLOTHING_SUBS = [
  { label: "Shirt", emoji: "Shirt" },
  { label: "Jeans", emoji: "Jeans" },
  { label: "Dress", emoji: "Dress" },
  { label: "Shoes", emoji: "Shoes" },
  { label: "Jacket", emoji: "Jacket" },
  { label: "Kurta", emoji: "Kurta" },
];

const CATEGORY_CARDS = [
  { label: "Electronics", emoji: "Tech", bg: "from-[#0f1923] to-[#1a3352]", text: "text-white" },
  { label: "Clothing", emoji: "Style", bg: "from-[#dbeafe] to-[#eff6ff]", text: "text-slate-900" },
  { label: "Books", emoji: "Read", bg: "from-[#0a1f0a] to-[#1a4a1a]", text: "text-white" },
  { label: "Home", emoji: "Home", bg: "from-[#1f1000] to-[#4a2800]", text: "text-white" },
  { label: "Sports", emoji: "Play", bg: "from-[#1a0f2e] to-[#2d1f5c]", text: "text-white" },
];

function Home() {
  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <BannerCarousel />

      <section className="bg-white py-5 border-b shadow-sm">
        <div className="container-app">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Shop by Fashion</h2>
            <Link
              to={{ pathname: PATHS.PRODUCTS, search: "?category=Clothing" }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {CLOTHING_SUBS.map((sub) => (
              <Link
                key={sub.label}
                to={{
                  pathname: PATHS.PRODUCTS,
                  search: `?category=Clothing&subcategory=${sub.label}`,
                }}
                className="flex flex-col items-center gap-1.5 rounded-lg bg-slate-50 py-3 px-2 text-center transition hover:bg-blue-50 hover:shadow"
              >
                <span className="text-sm font-bold text-slate-500">{sub.emoji}</span>
                <span className="text-xs font-semibold text-slate-700">{sub.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-6 border-b">
        <div className="container-app">
          <h2 className="mb-4 text-base font-bold text-slate-800">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {CATEGORY_CARDS.map((category) => (
              <Link
                key={category.label}
                to={{ pathname: PATHS.PRODUCTS, search: `?category=${category.label}` }}
                className={`group relative flex h-24 items-end overflow-hidden rounded-lg bg-gradient-to-br ${category.bg} p-3 transition hover:shadow-lg`}
              >
                <span className="absolute right-2 top-2 text-sm font-bold opacity-70 group-hover:scale-110 transition-transform">
                  {category.emoji}
                </span>
                <span className={`text-sm font-bold ${category.text}`}>{category.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function BannerCarousel() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setActive((index) => (index + 1) % BANNERS.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[active];
  const goTo = () =>
    navigate({
      pathname: PATHS.PRODUCTS,
      search: `?category=${banner.category}`,
    });

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-r ${banner.bg} cursor-pointer transition-all duration-700`}
      onClick={goTo}
      role="link"
      aria-label={`Go to ${banner.title}`}
      tabIndex={0}
      onKeyDown={(event) => event.key === "Enter" && goTo()}
    >
      <div className="container-app flex items-center justify-between py-14 md:py-20">
        <div className="max-w-md space-y-3">
          <p className={`text-xs font-bold uppercase tracking-widest ${banner.tagColor}`}>
            {banner.tag}
          </p>
          <h1 className={`text-4xl font-extrabold md:text-5xl ${banner.textColor}`}>
            {banner.title}
          </h1>
          <p className={`text-xl font-semibold ${banner.subColor}`}>{banner.sub}</p>
          <button
            onClick={(event) => {
              event.stopPropagation();
              goTo();
            }}
            className={`mt-2 inline-block rounded-sm px-7 py-2.5 text-sm font-bold shadow transition ${banner.btnClass}`}
          >
            Shop Now
          </button>
        </div>
        <span className={`hidden text-4xl font-black md:block select-none ${banner.textColor}`}>
          {banner.emoji}
        </span>
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={(event) => {
              event.stopPropagation();
              setActive(index);
            }}
            aria-label={`Slide ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              index === active ? "w-6 bg-current opacity-90" : "w-2 bg-current opacity-30 hover:opacity-60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
