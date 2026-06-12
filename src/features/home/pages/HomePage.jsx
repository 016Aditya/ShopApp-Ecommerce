import React, { useState, useEffect } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import DealSection from "@/components/home/DealSection";
import { Link } from "react-router-dom";
import PATHS from "@/routes/paths";
import { getFeaturedProducts } from "@/services/productService"; // ✅ Swapped hook for exact API call
import ProductCard from "@/features/products/components/ProductCard";

function HomePage() {
  // ✅ Replaced the generic hook with targeted state for Featured items
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // Hits http://localhost:8080/api/products/featured
        const data = await getFeaturedProducts(); 
        
        // Slicing to 8 just to ensure it perfectly fits your 4-column grid layout
        setFeatured(data.slice(0, 8));
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <HeroBanner />
      <DealSection />

      {/* Featured Products strip */}
      <div className="container-app pb-8">
        <div className="rounded-sm bg-white shadow-sm p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Featured Products</h2>
            <Link
              to={PATHS.PRODUCTS}
              className="rounded-sm bg-[#2874f0] px-6 py-2 text-sm font-bold text-white hover:bg-[#1a65e0] transition"
            >
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded bg-slate-100 h-52" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          )}
          
          {!loading && featured.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <p className="text-4xl mb-2">🛍️</p>
              <p className="font-medium">No products yet — add some from the backend!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;