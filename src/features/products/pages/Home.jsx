import { useMemo } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import PageLayout from "@/components/layout/PageLayout";
import ProductGrid from "@/features/products/components/ProductGrid";
import { PATHS } from "@/routes/paths";

const mockProducts = [
  {
    id: 1,
    title: "Wireless Headphones",
    description: "Premium sound quality with noise cancellation.",
    price: 4999,
    category: "Electronics",
    image: "",
  },
  {
    id: 2,
    title: "Smart Watch",
    description: "Track health metrics and stay connected on the go.",
    price: 2999,
    category: "Wearables",
    image: "",
  },
  {
    id: 3,
    title: "Running Shoes",
    description: "Comfortable and lightweight shoes for daily training.",
    price: 1999,
    category: "Fashion",
    image: "",
  },
  {
    id: 4,
    title: "Backpack",
    description: "Durable everyday backpack with multiple compartments.",
    price: 1499,
    category: "Accessories",
    image: "",
  },
];

function Home() {
  const featuredProducts = useMemo(() => mockProducts.slice(0, 4), []);

  return (
    <div className="space-y-10">
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 py-16 text-white">
        <div className="container-app flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-medium uppercase tracking-wide text-blue-200">
              New arrivals
            </p>
            <h1 className="text-4xl font-bold md:text-5xl">
              Discover products designed for everyday life.
            </h1>
            <p className="text-sm text-slate-200 md:text-base">
              Browse trending essentials, smart gadgets, and lifestyle products
              in one clean shopping experience.
            </p>
            <Link to={PATHS.SHOP}>
              <Button className="mt-2">Shop Now</Button>
            </Link>
          </div>

          <div className="rounded-2xl bg-white/10 p-6 backdrop-blur md:w-96">
            <p className="text-sm text-slate-200">Why shop with us</p>
            <ul className="mt-4 space-y-3 text-sm text-white">
              <li>Fast browsing experience</li>
              <li>Simple cart and checkout flow</li>
              <li>Modern responsive UI</li>
            </ul>
          </div>
        </div>
      </section>

      <PageLayout
        title="Featured Products"
        description="Explore a small curated set of products from our latest collection."
      >
        {featuredProducts.length ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <EmptyState
            title="No featured products"
            description="Featured items will appear here once products are available."
          />
        )}
      </PageLayout>
    </div>
  );
}

export default Home;