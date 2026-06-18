import { useState, useEffect } from "react";
import { getFeaturedProducts, getAllProducts } from "@/services/productService";

/**
 * useFeaturedProducts
 *
 * Two-tier fetch strategy:
 *   Tier 1 — GET /api/products/featured
 *     If the backend implements isFeatured and returns ≥1 product, use it.
 *
 *   Tier 2 — Fallback (GET /api/products)
 *     Triggered when:
 *       - /featured returns 404 or any network/server error
 *       - /featured returns an empty array (no products marked featured yet)
 *     Sorts all products by createdAt DESC and returns the latest 6.
 *
 * This ensures Featured Products always renders something as long as the
 * backend has ANY products, with zero dependency on seed data.
 */
export const useFeaturedProducts = () => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      // ── Tier 1: dedicated featured endpoint ───────────────────────
      try {
        const featured = await getFeaturedProducts();
        if (!cancelled && Array.isArray(featured) && featured.length > 0) {
          setProducts(featured);
          setUsingFallback(false);
          setLoading(false);
          return;
        }
      } catch {
        // 404 or server error — fall through to Tier 2
      }

      // ── Tier 2: latest 6 products fallback ────────────────────────
      try {
        const all = await getAllProducts();
        if (!cancelled) {
          const sorted = [...(Array.isArray(all) ? all : [])]
            .sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            })
            .slice(0, 6);
          setProducts(sorted);
          setUsingFallback(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load products");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error, usingFallback };
};
