import { useEffect } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import DealSection from '@/components/home/DealSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import { prefetchProductsPage } from '@/utils/prefetch';

function HomePage() {
  // Stage 1: prefetch the Products page during idle time so navigation
  // from Home → Products feels instant.
  useEffect(() => {
    prefetchProductsPage();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <HeroBanner />
      <DealSection />
      <FeaturedProducts />
    </div>
  );
}

export default HomePage;
