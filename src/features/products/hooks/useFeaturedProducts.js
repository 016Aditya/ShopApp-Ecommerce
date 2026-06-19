import { useState, useEffect } from "react";
import { getFeaturedProducts } from "@/services/productService";

/**
 * useFeaturedProducts
 *
 * Fetches products where featured === true from the backend.
 * The backend is the single source of truth for which products are featured.
 */
export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const featured = await getFeaturedProducts();
        if (!cancelled) {
          setProducts(Array.isArray(featured) ? featured : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to load featured products");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return { products, loading, error };
};
