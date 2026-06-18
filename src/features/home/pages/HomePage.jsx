import HeroBanner from "@/components/home/HeroBanner";
import DealSection from "@/components/home/DealSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <HeroBanner />
      <DealSection />
      <FeaturedProducts />
    </div>
  );
}

export default HomePage;
