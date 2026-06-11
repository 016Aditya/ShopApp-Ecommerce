import { useState, useEffect, useCallback } from "react";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsByCategoryAndSubcategory,
  searchProducts,
} from "@/services/productService";

// ─── All products + filters ────────────────────────────────────────────
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const run = useCallback(async (apiFn) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFn();
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(
    () => run(getAllProducts),
    [run]
  );

  const fetchByCategory = useCallback(
    (category) => run(() => getProductsByCategory(category)),
    [run]
  );

  const fetchByCategoryAndSubcategory = useCallback(
    (category, subcategory) =>
      run(() => getProductsByCategoryAndSubcategory(category, subcategory)),
    [run]
  );

  const fetchBySearch = useCallback(
    (keyword) => run(() => searchProducts(keyword)),
    [run]
  );

  // NO fetchAll() on mount.
  // ProductsPage reads ?category= from URL and decides what to fetch.
  // The old fetchAll() here was overwriting the category param on every mount.

  return {
    products,
    loading,
    error,
    fetchAll,
    fetchByCategory,
    fetchByCategoryAndSubcategory,
    fetchBySearch,
  };
};

// ─── Single product ──────────────────────────────────────────────────────────
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled)
          setError(err.response?.data?.message || "Product not found");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [id]);

  return { product, loading, error };
};
