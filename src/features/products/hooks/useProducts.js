import { useState, useEffect, useCallback } from "react";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
} from "@/services/productService";

// ─── All products + search + category filter ──────────────────────────────
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();   // ← no { data } — service returns array directly
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsByCategory(category);
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load category");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBySearch = useCallback(async (keyword) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(keyword);
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { products, loading, error, fetchAll, fetchByCategory, fetchBySearch };
};

// ─── Single product ────────────────────────────────────────────────────────
export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);  // ← no { data } — service returns object directly
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  return { product, loading, error };
};