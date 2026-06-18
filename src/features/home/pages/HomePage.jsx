import HeroBanner from "@/components/home/HeroBanner";
import DealSection from "@/components/home/DealSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";

function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <HeroBanner />
      <DealSection />
      <FeaturedProducts />
    </div>
  );
}

export default HomePage;
