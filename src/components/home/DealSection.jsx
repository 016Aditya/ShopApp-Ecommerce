import { Link } from "react-router-dom";
import PATHS from "@/routes/paths";

const productPath = (category, subcategory) => {
  const params = new URLSearchParams({ category });
  if (subcategory) params.set("subcategory", subcategory);
  return `${PATHS.PRODUCTS}?${params.toString()}`;
};

const DEALS = [
  {
    title: "Top Electronics",
    subtitle: "Up to 60% off",
    link: productPath("Electronics"),
    items: [
      { label: "Mobiles", emoji: "📱", bg: "bg-blue-50", link: productPath("Electronics", "Mobile") },
      { label: "Laptops", emoji: "💻", bg: "bg-indigo-50", link: productPath("Electronics", "Laptop") },
      { label: "Earphones", emoji: "🎧", bg: "bg-purple-50", link: productPath("Electronics", "Headphones") },
      { label: "Cameras", emoji: "📷", bg: "bg-pink-50", link: productPath("Electronics", "Camera") },
    ],
  },
  {
    title: "Fashion Deals",
    subtitle: "Min. 40% off",
    link: productPath("Clothing"),
    items: [
      { label: "Men's Wear", emoji: "👔", bg: "bg-sky-50", link: productPath("Clothing", "Shirt") },
      { label: "Women's", emoji: "👗", bg: "bg-rose-50", link: productPath("Clothing", "Dress") },
      { label: "Footwear", emoji: "👟", bg: "bg-orange-50", link: productPath("Clothing", "Shoes") },
      { label: "Accessories", emoji: "👜", bg: "bg-yellow-50", link: productPath("Clothing") },
    ],
  },
  {
    title: "Home & Kitchen",
    subtitle: "Starting ₹199",
    link: productPath("Home"),
    items: [
      { label: "Furniture", emoji: "🛋️", bg: "bg-green-50", link: productPath("Home", "Furniture") },
      { label: "Kitchen", emoji: "🍳", bg: "bg-lime-50", link: productPath("Home", "Kitchen") },
      { label: "Decor", emoji: "🪴", bg: "bg-emerald-50", link: productPath("Home", "Decor") },
      { label: "Bedding", emoji: "🛏️", bg: "bg-teal-50", link: productPath("Home") },
    ],
  },
  {
    title: "Books & Sports",
    subtitle: "Deals from ₹99",
    link: productPath("Books"),
    items: [
      { label: "Bestsellers", emoji: "📚", bg: "bg-amber-50", link: productPath("Books", "Novel") },
      { label: "Sports Gear", emoji: "⚽", bg: "bg-red-50", link: productPath("Sports") },
      { label: "Fitness", emoji: "🏋️", bg: "bg-orange-50", link: productPath("Sports", "Gym") },
      { label: "Outdoor", emoji: "🏕️", bg: "bg-stone-50", link: productPath("Sports") },
    ],
  },
];

function DealSection() {
  return (
    <div className="container-app py-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEALS.map((deal) => (
          <div key={deal.title} className="rounded-sm bg-white shadow-sm p-4 flex flex-col">
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">{deal.title}</h2>
                <p className="text-xs text-[#2874f0] font-semibold">{deal.subtitle}</p>
              </div>
              <Link
                to={deal.link}
                className="text-xs text-[#2874f0] font-medium hover:underline"
              >
                See more
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 flex-1">
              {deal.items.map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className={`flex flex-col items-center justify-center rounded-sm p-4 ${item.bg} hover:opacity-80 transition gap-2`}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="text-xs font-medium text-slate-700 text-center">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DealSection;
