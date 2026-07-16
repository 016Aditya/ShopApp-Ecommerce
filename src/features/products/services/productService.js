/**
 * productService.js — Commit 3 addition
 * Fetches the latest single product (used to refresh stock after a 409).
 */
import api from '@/services/api';

export const fetchProductById = (productId) =>
  api.get(`/products/${productId}`).then((res) => res.data);